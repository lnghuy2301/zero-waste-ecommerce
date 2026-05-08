# cd chatbot
# .\venv\Scripts\activate
#  python api_chatbot.py
import os
import sys
import json
import re
# Thư viện cho API
from flask import Flask, request, jsonify 

# Thư viện Groq và LangChain
from groq import Groq
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import FAISS

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableBranch, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from flask_cors import CORS
from typing import List
from langchain_core.documents import Document


GROQ_API_KEY = YOUR_KEY_HERE
LLM_MODEL = "llama-3.1-8b-instant"
# Đổi đường dẫn này cho phù hợp với máy cục bộ (ví dụ: "./data_txt" nếu data nằm cùng thư mục)
DATA_FOLDER = "./data_txt" 
VECTOR_INDEX_PATH = "faiss_index_txt"

# Khởi tạo Flask App
app = Flask(__name__)
CORS(app)
# Khai báo biến Global để lưu trữ LangChain components
llm = None
pdf_retriever = None
general_chat_chain = None
router_chain = None
final_combined_chain = None

def extract_image_url(response_text: str):
    """Trích xuất URL hình ảnh từ chuỗi trả lời của LLM theo cú pháp [IMAGE_URL: URL]."""
    # Tìm chuỗi theo định dạng [IMAGE_URL: URL]
    match = re.search(r"\[IMAGE_URL:\s*(.*?)\]", response_text)
    
    image_url = ""
    cleaned_text = response_text
    
    if match:
        image_url = match.group(1).strip()
        # Loại bỏ cú pháp [IMAGE_URL: URL] khỏi nội dung trả lời
        # Sử dụng re.sub với count=1 để đảm bảo chỉ loại bỏ lần xuất hiện đầu tiên (và duy nhất)
        cleaned_text = re.sub(r"\[IMAGE_URL:\s*.*?\]\s*", "", response_text, 1).strip()
    
    return cleaned_text, image_url

# ======================= HÀM TẠO RETRIEVER =======================
def create_retriever(data_folder: str, index_path: str):
    """
    Tạo hoặc tải Vector Store (FAISS index) và trả về Retriever.
    """
    # Sử dụng model nhúng đa ngôn ngữ
    embeddings = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large")

    # 1. Thử tải index nếu đã tồn tại
    if os.path.exists(index_path):
        try:
            # Đảm bảo bạn đã cài đặt faiss-cpu
            vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
            print(f"Đã tải Vector Store từ '{index_path}'.")
            return vector_store.as_retriever(search_kwargs={"k": 5}) # Giảm k để nhanh hơn
        except Exception as e:
            print(f"Lỗi khi tải Vector Store: {e}. Tiến hành tạo lại.")

    # 2. Tạo index mới nếu không tồn tại hoặc lỗi tải
    if not os.path.exists(data_folder):
        print(f"Lỗi: Thư mục dữ liệu không tồn tại: {data_folder}")
        return None

    data_files = [f for f in os.listdir(data_folder) if f.endswith('.txt')]
    if not data_files:
        print(f"Lỗi: Không tìm thấy file TXT nào trong thư mục '{data_folder}'.")
        return None

    all_docs = []
    for filename in data_files:
        file_path = os.path.join(data_folder, filename)
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            all_docs.extend(loader.load())
        except Exception as e:
            print(f"Lỗi đọc file {filename}: {e}")

    if not all_docs:
        print("Lỗi: Không có tài liệu nào được load thành công.")
        return None

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    document_chunks = text_splitter.split_documents(all_docs)

    vector_store = FAISS.from_documents(document_chunks, embeddings)
    vector_store.save_local(index_path)
    print(f" Đã tạo Vector Store mới và lưu tại '{index_path}'.")
    return vector_store.as_retriever(search_kwargs={"k": 5})

# ======================= HÀM KHỞI TẠO CHATBOT (CHỈ CHẠY 1 LẦN) =======================
def initialize_chatbot():
    global llm, pdf_retriever, general_chat_chain, router_chain, final_combined_chain

    # 1. Khởi tạo LLM
    llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name=LLM_MODEL, temperature=0.0)
    
    # 2. Tạo Retriever
    pdf_retriever = create_retriever(DATA_FOLDER, VECTOR_INDEX_PATH)

    # 3. Định nghĩa RAG Chain
    rag_template = """
    Bạn là "EcoBot" - Trợ lý bán hàng thông minh và tận tâm của cửa hàng Zero-Waste Store.
    Nhiệm vụ của bạn là tư vấn các sản phẩm thân thiện với môi trường dựa trên CONTEXT được cung cấp.

    QUAN TRỌNG VỀ ĐỊNH DẠNG TRẢ LỜI: 
    
    1. QUY TẮC HÌNH ẢNH:
       - Nếu CONTEXT có chứa thẻ **[LINK ẢNH]**, bạn BẮT BUỘC phải tạo ra một thẻ đặc biệt ở **DÒNG ĐẦU TIÊN VÀ DUY NHẤT** của câu trả lời, sử dụng chính xác cú pháp sau: [IMAGE_URL: URL_HÌNH_ẢNH_ĐƯỢC_TRÍCH_XUẤT]
       - Ngoài cú pháp trên, TUYỆT ĐỐI không viết lại link ảnh dưới bất kỳ hình thức nào khác trong phần văn bản trả lời cho người dùng.

    2. LỌC NỘI DUNG VÀ VĂN PHONG:
       - Chỉ cung cấp những thông tin hữu ích cho khách hàng: Tên sản phẩm, Giá bán, Phân loại (màu sắc/kích thước), Chất liệu, Lợi ích môi trường, và Khả năng tái sử dụng.
       - Viết câu trả lời một cách tự nhiên, thân thiện như đang trò chuyện.
       - **KHÔNG** được in ra các thẻ kỹ thuật như `[LINK SẢN PHẨM]`, các mã ID khó hiểu, hoặc cú pháp hệ thống.

    3. CẤU TRÚC PHẢN HỒI: 
       - Bắt đầu phần trả lời bằng văn bản (phần người dùng đọc được) từ dòng thứ hai, ngay sau dòng [IMAGE_URL:...] (nếu có).
       - Nhấn mạnh vào các giá trị "xanh" của sản phẩm để thuyết phục khách hàng. Ví dụ: "Sản phẩm này được làm từ tre tái chế, giúp giảm thiểu rác thải nhựa đó ạ."

    4. XỬ LÝ LINK SẢN PHẨM: 
       - Nếu CONTEXT có chứa thẻ **[LINK SẢN PHẨM]**, bạn phải khéo léo biến nó thành một lời kêu gọi hành động ở cuối câu trả lời.
       - Ví dụ: "Bạn có thể xem chi tiết và đặt mua sản phẩm này [tại đây](URL_SẢN_PHẨM) nhé!"
       - Sử dụng đúng định dạng Markdown `[text](link)`.

    5. TƯ VẤN SẢN PHẨM: 
       - Nếu khách hàng hỏi tìm sản phẩm chung chung (ví dụ: "Tôi muốn tìm đồ dùng nhà bếp"), hãy liệt kê các sản phẩm liên quan có trong CONTEXT, kèm theo giá bán của chúng.
    
    6. KHI KHÔNG CÓ THÔNG TIN: 
       - Nếu CONTEXT không chứa thông tin khách yêu cầu, hãy trả lời một cách lịch sự và gợi mở: "Dạ, rất tiếc hiện tại EcoBot chưa có thông tin chi tiết về sản phẩm này. Bạn có muốn tham khảo các sản phẩm xanh khác của cửa hàng không ạ?"

    CONTEXT:
    {context}

    CÂU HỎI CỦA NGƯỜI DÙNG: {question}

    TRẢ LỜI:
    """
    rag_prompt = ChatPromptTemplate.from_template(rag_template)
    
    if pdf_retriever:
        rag_chain = (
            {
                # Dùng pdf_retriever.invoke thay vì simple_retrieval
                "context": RunnableLambda(lambda x: pdf_retriever.invoke(x["question"])),
                "question": RunnablePassthrough(),
            }
            | rag_prompt
            | llm
            | StrOutputParser()
        )
    else:
        # Xử lý nếu Retriever không khả dụng
        rag_chain = RunnableLambda(lambda x: "Lỗi: Không thể truy vấn dữ liệu vì Retriever không khả dụng.")
        
    # 4. Định nghĩa General Chat Chain
    general_template = """
    Bạn là "EcoBot" - Trợ lý ảo của cửa hàng Zero-Waste Store.
    Bạn rất yêu thiên nhiên, thích lối sống xanh và luôn thân thiện, lịch sự.
    Hãy trả lời các câu chào hỏi hoặc câu hỏi giao tiếp thông thường của người dùng một cách ngắn gọn, vui vẻ bằng tiếng Việt.
    Luôn khuyến khích họ chung tay bảo vệ môi trường.
    """
    general_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", general_template),
            ("user", "{question}"),
        ]
    )
    general_chat_chain = general_prompt | llm | StrOutputParser()

    # 5. Định nghĩa Router Chain
    router_template = """
    Bạn là một bộ định tuyến thông minh (Router).
    Nhiệm vụ của bạn là phân loại ý định của người dùng thành một trong hai loại: 'RAG' hoặc 'GENERAL'.

    1. Trả về 'RAG' (Retrieval-Augmented Generation) khi:
        - Người dùng hỏi mua hàng, hỏi giá, hỏi tìm sản phẩm.
        - Người dùng hỏi về chất liệu, mức độ thân thiện môi trường, tái chế.
        - Người dùng hỏi về chính sách giao hàng, thanh toán, khuyến mãi của cửa hàng.

    2. Trả về 'GENERAL' khi:
        - Người dùng chỉ nói "Xin chào", "Cảm ơn", "Tạm biệt".
        - Người dùng hỏi những câu không liên quan đến mua sắm hay môi trường (ví dụ: thời tiết, làm toán, kể chuyện).

    Chỉ trả lời bằng đúng MỘT TỪ DUY NHẤT: 'RAG' hoặc 'GENERAL'. KHÔNG thêm dấu câu hay bất kỳ từ nào khác.
    """
    router_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", router_template),
            ("user", "{question}"),
        ]
    )
    router_chain = router_prompt | llm | StrOutputParser()

    def route_question(input_data):
        """Hàm giúp Router chạy và trả về kết quả phân loại."""
        # Chạy router và chuẩn hóa kết quả về chữ thường
        intent = router_chain.invoke({"question": input_data["question"]}).strip().lower()
        print(f"DEBUG: Router phân loại là: {intent.upper()}")
        return intent

    # 6. Kết hợp Final Chain (Router)
    if pdf_retriever is None:
        final_combined_chain = general_chat_chain
    else:
        final_combined_chain = RunnableBranch(
            # Điều kiện 1: Nếu Router trả về 'rag', chạy rag_chain
            (lambda x: route_question(x) == "rag", rag_chain),
            # Điều kiện 2: Nếu không phải 'rag', chạy general_chat_chain
            general_chat_chain,
        )
        
    print(" Đã kích hoạt chatbot (RAG + General) và sẵn sàng nhận yêu cầu API.")


# ======================= ROUTE API CỦA FLASK =======================

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """
    Endpoint chính để nhận câu hỏi từ người dùng và trả về phản hồi của chatbot.
    """
    # 1. Kiểm tra khởi tạo
    if final_combined_chain is None:
        return jsonify({
            "status": "error",
            "message": "Chatbot chưa được khởi tạo. Vui lòng kiểm tra logs server."
        }), 500
        
    # 2. Xử lý Request
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({
                "status": "error",
                "message": "Thiếu trường 'question' trong JSON body (cần gửi: {\"question\": \"Câu hỏi của bạn\"})."
            }), 400

        user_question = data.get('question')

        # 3. Gọi LangChain (Router sẽ tự động chuyển hướng RAG/General)
        response_text = final_combined_chain.invoke({"question": user_question})
        cleaned_text, image_url = extract_image_url(response_text)
        # 4. Trả về Response
        return jsonify({
            "status": "success",
            "response": response_text,
            "image_url": image_url       # URL hình ảnh
        })

    except Exception as e:
        print(f"Lỗi xử lý API: {e}")
        return jsonify({
            "status": "error",
            "message": f"Đã xảy ra lỗi trong quá trình xử lý: {str(e)}"
        }), 500


# ======================= CHẠY ỨNG DỤNG FLASK =======================

if __name__ == '__main__':
    print("Đang khởi tạo LangChain/Groq components. Vui lòng chờ...")
    
    # Khởi tạo tất cả các thành phần LangChain/Groq một lần duy nhất khi server bắt đầu
    initialize_chatbot() 
    
    # Chạy Flask Server
    print("-" * 50)
    print(" API Chatbot đã chạy.")
    print("Sử dụng POST request đến: http://127.0.0.1:5000/api/chat")
    print("-" * 50)
    app.run(debug=True)