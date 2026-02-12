import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./DealerDetails.css";
import "../assets/style.css";
import Header from '../Header/Header';

const DealerDetails = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDealerDetails = async () => {
      try {
        // Fetch dealer details
        const dealerRes = await fetch(`/djangoapp/dealer/${id}`);
        const dealerData = await dealerRes.json();
        
        if (dealerData.status === 200) {
          setDealer(dealerData.dealer);
        } else {
          setError('Dealer not found');
        }

        // Fetch dealer reviews
        const reviewsRes = await fetch(`/djangoapp/reviews/dealer/${id}`);
        const reviewsData = await reviewsRes.json();
        
        if (reviewsData.status === 200) {
          setReviews(reviewsData.reviews);
        }
      } catch (err) {
        setError('Error fetching dealer details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerDetails();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading dealer details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div>
        <Header />
        <div className="error">Dealer not found</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="dealer-details-container">
        <h1>{dealer.full_name}</h1>
        <div className="dealer-info">
          <p><strong>Address:</strong> {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>
          {dealer.short_name && <p><strong>Short Name:</strong> {dealer.short_name}</p>}
        </div>

        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3>{review.name}</h3>
                  {review.sentiment && (
                    <span className={`sentiment-badge ${review.sentiment.sentiment}`}>
                      {review.sentiment.sentiment}
                    </span>
                  )}
                </div>
                <p className="review-text">{review.review}</p>
                {review.purchase && (
                  <div className="purchase-info">
                    <p><strong>Purchased:</strong> {review.car_make} {review.car_model} ({review.car_year})</p>
                    <p><strong>Purchase Date:</strong> {review.purchase_date}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {sessionStorage.getItem("username") && (
          <a href={`/postreview/${id}`} className="add-review-btn">
            Add Review
          </a>
        )}
      </div>
    </div>
  );
};

export default DealerDetails;
