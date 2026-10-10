import { HealthStatusCard } from './HealthStatus';

const signs = [
  'Tiêu đề gây sốc',
  'Chủ đề nhạy cảm',
  'Ngôn từ công kích',
  'Thiếu ngữ cảnh',
  'Gài lời tranh cãi',
];
const steps = ['Nhận diện', 'Dừng lại', 'Kiểm chứng', 'Cân nhắc', 'Hành động'];

export function HomePage() {
  return (
    <div className="landing-page">
      <section className="hero" id="ragebait">
        <div className="wrap hero-grid">
          <div>
            <p className="badge">CẨM NANG RAGE SHIELD</p>
            <h1>
              Đừng để cơn giận <span>lái</span> bạn trên mạng.
            </h1>
            <p className="lede">
              Nhận diện Rage Bait, làm chủ cảm xúc và chọn cách phản hồi văn minh.
            </p>
            <div className="actions">
              <a className="button dark" href="#rage-shield">
                Xem 5 bước
              </a>
              <a className="button light" href="#dau-hieu">
                Nhận biết dấu hiệu
              </a>
            </div>
          </div>
          <GuideMockup />
        </div>
      </section>
      <section className="marquee">
        <div>
          TIKTOK <b>•</b> FACEBOOK <b>•</b> YOUTUBE <b>•</b> INSTAGRAM <b>•</b> TIKTOK <b>•</b>{' '}
          FACEBOOK <b>•</b> YOUTUBE <b>•</b> INSTAGRAM
        </div>
      </section>
      <section className="section white" id="dau-hieu">
        <div className="wrap">
          <Intro
            label="RAGE BAIT LÀ GÌ?"
            title="Nội dung được thiết kế để khiến bạn nổi giận và tương tác."
          />
          <div className="contrast">
            <article className="problem">
              <p>VÒNG LẶP RAGE BAIT</p>
              <ol>
                <li>Gặp nội dung gây kích động</li>
                <li>Cảm xúc bị đẩy lên cao</li>
                <li>Bình luận, tranh cãi hoặc chia sẻ</li>
                <li>Thuật toán phân phối rộng hơn</li>
              </ol>
            </article>
            <article className="solution">
              <p>BẠN CÓ QUYỀN DỪNG LẠI</p>
              <h3>Không phải điều gì làm bạn tức giận cũng cần phản hồi ngay.</h3>
              <p>Khoảng dừng ngắn giúp bạn kiểm chứng thông tin và bảo vệ năng lượng của mình.</p>
              <a href="#rage-shield">Xem quy trình xử lý →</a>
            </article>
          </div>
          <div className="signs">
            {signs.map((sign, index) => (
              <article key={sign}>
                <span>0{index + 1}</span>
                <h3>{sign}</h3>
                <p>
                  {
                    [
                      'Dùng câu chữ quá đà để kéo bạn phản ứng ngay.',
                      'Khai thác bất đồng để biến trò chuyện thành đối đầu.',
                      'Gán nhãn, xúc phạm hoặc kích động người xem.',
                      'Cắt ghép, phiến diện hoặc chưa kiểm chứng đầy đủ.',
                      'Thúc đẩy bình luận, chia sẻ để lan truyền nhanh hơn.',
                    ][index]
                  }
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section shield" id="rage-shield">
        <div className="wrap">
          <Intro
            label="QUY TRÌNH RAGE SHIELD"
            title="Năm bước để không biến cơn giận thành lượt tương tác."
          />
          <div className="steps">
            {steps.map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <h3>{step}</h3>
                <p>
                  {
                    [
                      'Có dấu hiệu câu tương tác, công kích hay bóp méo thông tin không?',
                      'Nội dung đang khiến mình cảm thấy thế nào?',
                      'Nguồn tin có đáng tin và đủ ngữ cảnh không?',
                      'Phản hồi của mình có thật sự phù hợp không?',
                      'Bỏ qua, kiểm chứng thêm, phản hồi văn minh hoặc báo cáo.',
                    ][index]
                  }
                </p>
              </article>
            ))}
          </div>
          <p className="note">
            AI có thể hỗ trợ phân tích dấu hiệu, nhưng quyết định cuối cùng luôn thuộc về bạn.
          </p>
        </div>
      </section>
      <section className="section sage" id="so-lieu">
        <div className="wrap">
          <Intro label="TỪ KHẢO SÁT THỰC TẾ" title="Rage Bait không xa lạ với học sinh THPT." />
          <p className="source">
            Khảo sát trực tuyến hợp lệ N = 251 học sinh, Trường THPT Nguyễn Trãi - Bình Dương, 2026.
          </p>
          <div className="stats">
            <article>
              <strong>79,7%</strong>
              <p>dùng mạng xã hội từ 2 giờ mỗi ngày trở lên.</p>
            </article>
            <article>
              <strong>56,2%</strong>
              <p>cho biết TikTok là nền tảng được dùng thường xuyên.</p>
            </article>
            <article>
              <strong>51,6%</strong>
              <p>đồng ý hoặc hoàn toàn đồng ý về mức độ tiếp xúc Rage Bait.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section white">
        <div className="wrap">
          <Intro label="TRONG LÚC BẠN LƯỚT" title="Chọn cách bình tĩnh hơn là cách ồn ào hơn." />
          <div className="scenarios">
            <article>
              <b>HỌC SINH</b>
              <h3>“Mình muốn bình luận ngay.”</h3>
              <p>Dừng một phút. Tự hỏi điều gì đang khiến mình nóng lên trước khi gõ.</p>
            </article>
            <article>
              <b>KHI GẶP TIN GÂY SỐC</b>
              <h3>“Thông tin này đã đủ ngữ cảnh chưa?”</h3>
              <p>Tìm nguồn gốc, đọc thêm và không lan truyền nội dung chưa kiểm chứng.</p>
            </article>
            <article>
              <b>CỘNG ĐỒNG LỚP HỌC</b>
              <h3>Phản hồi tôn trọng hoặc không tương tác.</h3>
              <p>Báo cáo nội dung có hại khi cần. Một lựa chọn bình tĩnh cũng là hành động.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="final">
        <div className="wrap">
          <p>LÀM CHỦ CÁCH BẠN PHẢN HỒI</p>
          <h2>
            Thấy kích động?
            <br />
            Đừng vội tương tác.
          </h2>
          <a className="button dark" href="#rage-shield">
            Bắt đầu với RAGE SHIELD
          </a>
        </div>
      </section>
      <footer>
        <div className="wrap foot">
          <div>
            <h3>↯ ragebait</h3>
            <p>Nhận diện Rage Bait. Làm chủ cảm xúc. Ứng xử văn minh.</p>
          </div>
          <div>
            <b>KHÁM PHÁ</b>
            <a href="#dau-hieu">Dấu hiệu</a>
            <a href="#rage-shield">Rage Shield</a>
            <a href="#so-lieu">Số liệu</a>
          </div>
          <div>
            <b>TRẠNG THÁI HỆ THỐNG</b>
            <HealthStatusCard />
          </div>
        </div>
      </footer>
    </div>
  );
}

function Intro({ label, title }: { label: string; title: string }) {
  return (
    <div className="intro">
      <p>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}
function GuideMockup() {
  return (
    <div className="mockup">
      <div className="bar">
        <i />
        <i />
        <i /> RAGE SHIELD GUIDE
      </div>
      <div className="mock-content">
        <div className="alert">
          ! <b>PAUSE BEFORE YOU POST</b>
          <small>Cảm xúc mạnh không phải tín hiệu để vội phản hồi.</small>
        </div>
        <div className="mock-grid">
          <div>
            NHẬN DIỆN
            <br />
            <b>Giật gân?</b>
          </div>
          <div>
            DỪNG LẠI
            <br />
            <strong>60s</strong>
          </div>
          <div>
            KIỂM CHỨNG
            <br />
            <b>Tìm nguồn gốc.</b>
          </div>
        </div>
        <div className="mock-bottom">KHÔNG CHIA SẺ KHI CHƯA KIỂM CHỨNG.</div>
      </div>
    </div>
  );
}
