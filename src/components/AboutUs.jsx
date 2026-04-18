import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <section className="about-page">
      <div className="about-us-container">
        <div className="about-card">
          <h2>About Paradise Nursery</h2>
          <p>
            Paradise Nursery is an online plant store focused on healthy,
            low-maintenance, and air-purifying houseplants for homes and offices.
          </p>
          <p>
            We source directly from trusted growers, provide detailed care
            guidance, and package every order carefully to keep plants safe in
            transit.
          </p>
          <p>
            Our mission is to make plant parenting simple, joyful, and
            accessible for everyone.
          </p>
          <Link to="/plants" className="cta-button small">
            Explore Plants
          </Link>
        </div>
      </div>
    </section>
  );
}