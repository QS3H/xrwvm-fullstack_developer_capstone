import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ReviewSubmission.css";
import "../assets/style.css";
import Header from '../Header/Header';

const ReviewSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: sessionStorage.getItem("username") || '',
    review: '',
    purchase: false,
    purchase_date: '',
    car_make: '',
    car_model: '',
    car_year: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const reviewData = {
        ...formData,
        dealership: parseInt(id),
        purchase: formData.purchase
      };

      const response = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      const result = await response.json();

      if (result.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/dealer/${id}`);
        }, 2000);
      } else if (result.status === 401) {
        setError('You must be logged in to submit a review');
      } else if (result.status === 403) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('Error submitting review. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div>
        <Header />
        <div className="success-message">
          <h2>Review Submitted Successfully!</h2>
          <p>Redirecting to dealer page...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="review-submission-container">
        <h1>Write a Review</h1>
        <p className="subtitle">Share your experience with this dealership</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="review">Your Review:</label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              required
              rows="5"
              className="form-textarea"
              placeholder="Share your experience with this dealership..."
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="purchase"
                checked={formData.purchase}
                onChange={handleChange}
              />
              Did you purchase a vehicle from this dealership?
            </label>
          </div>

          {formData.purchase && (
            <div className="purchase-details">
              <h3>Purchase Details</h3>
              
              <div className="form-group">
                <label htmlFor="purchase_date">Purchase Date:</label>
                <input
                  type="date"
                  id="purchase_date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="car_make">Car Make:</label>
                  <input
                    type="text"
                    id="car_make"
                    name="car_make"
                    value={formData.car_make}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Toyota"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="car_model">Car Model:</label>
                  <input
                    type="text"
                    id="car_model"
                    name="car_model"
                    value={formData.car_model}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Camry"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="car_year">Car Year:</label>
                  <input
                    type="number"
                    id="car_year"
                    name="car_year"
                    value={formData.car_year}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 2023"
                    min="1900"
                    max="2099"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/dealer/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmission;
