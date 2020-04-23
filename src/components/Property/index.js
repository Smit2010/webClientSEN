import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { SERVER_URL } from "../../utils/constants";
import { Carousel } from "react-responsive-carousel";
import ReactMapGL, { Marker } from "react-map-gl";
import Review from "./Review";
import "./style.css";

class Extended extends Component {
	constructor(props) {
		super(props);
		this.state = {
			property: null,
            reviews: [],
            reviewsVisible: 3,
            reviewInput: "",
			viewport: {
				latitude: 23.0225,
				longitude: 72.5714,
				zoom: 10,
				width: "100vw",
				height: "70vh",
			},
		};
    };
    
	async componentDidMount() {
		const propertyId = this.props.match.params.id;

		const url = SERVER_URL + "/property/" + propertyId;

		const response = await fetch(url);
		const data = await response.json();
		this.setState({ property: data.property[0] });
    }
    
    viewMore = () => {
		this.setState({ reviewsVisible: this.state.reviewsVisible + 4 });
    };
    
    handleChange = (event) => {
		this.setState({ reviewInput: event.target.value });
	};

	submitReview = () => {
		console.log(this.state.reviewInput);
	};

	RenderReviews = () => {
		const { reviews } = this.state;
		if (!reviews.length) return <div> No reviews to show!</div>;
		return (
            <div class="container">
                {reviews.slice(0, this.state.reviewsVisible).map((review, i) => (
                    <Review
                        author={review.author}
                        date={review.date}
                        text={review.text}
                    />
                ))}
            </div>
		);
    };

    RenderButton = () => {
        const { reviewsVisible, reviews } = this.state;
        if(reviewsVisible < reviews.length && reviews.length){
            return (
                <div class="block" style={{ textAlign: "center" }}>
                    <button class="button is-primary" onClick={this.viewMore}>
                        View more
                    </button>
                </div>
            );
        }
    }
    
    RenderWriteReview = () => {
        if(this.props.isAuthenticated){
            return (
                <div class="box">
                    <h1 class="title is-4">Write a Review</h1>
                    <div class="field">
                        <div class="control">
                            <textarea
                                class="textarea"
                                placeholder="Write a review..."
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <button class="button is-primary" onClick={this.submitReview} >
                        Submit
                    </button>
                </div>
            );
        } else {
            return <h1 class="subtitle" style={{ fontFamily: "Pacifico" }}>Login to write a review...</h1>
        }
    }

	render() {
		const { property } = this.state;

		if (!property) {
			return (
				<progress class="progress is-medium is-dark" max="100">45%</progress>
			);
		}

		return (
			<div class="container">
				<div class="box">
					<div class="level">
						<div class="level-left ">
							<h1 class="title is-3">
								{property.propertyName}
							</h1>
						</div>
						<div class="level-right">
							<span class="icon">
								<i className="far fa-star" />
							</span>
						</div>
					</div>
					<div class="level-item level-left" style={{ paddingBottom: "10px" }}>
						<i className="fas fa-map-marker-alt" />
						&nbsp;
						<p>{property.address}</p>
					</div>
					<div class="tags">
                        <div class="field is-grouped is-grouped-multiline">
							<div class="control">
								<div class="tags has-addons">
                                    <span class="tag is-primary">RERA certified</span>
								</div>
							</div>
							<div class="control">
								<div class="tags has-addons">
                                    <span class="tag is-success">Verified</span>
								</div>
							</div>
							<div class="control">
								<div class="tags has-addons">
									<span class="tag is-dark">Furnished</span>
									<span class="tag is-info">
										{property.furnished}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="block">
					<div className="columns is-gapless">
						<div class="column">
							<Carousel
								showArrows={true}
								infiniteLoop
								autoPlay
								showStatus={false}
								useKeyboardArrows
								width="500px">
								{property.images.map((image) => (
									<figure key={image.photoId} className="image is-4by3">
										<img src={`${SERVER_URL}/${image.imagePath}`} alt="Property"/>
									</figure>
								))}
							</Carousel>
						</div>
						<div className="column">
							<div class="tile is-ancestor">
								<div class="tile is-parent is-vertical">
									<article class="tile is-child box">
										<p>Area: </p>
										<div class="level-item">
											<p class="subtitle">
												<strong>
													{property.totalSqft}
												</strong>
											</p>
											<span style={{ marginBottom: 0 }}>
												<i>&nbsp;sq.ft</i>
											</span>
										</div>
									</article>
									<article class="tile is-child box">
										<p>Price: </p>
										<div class="level-item">
											<p class="subtitle">
												<strong>
													Rs {property.price}
												</strong>
											</p>
										</div>
									</article>
									<article class="tile is-child box">
										<p>Transaction Type: </p>
										<div class="level-item">
											<p class="subtitle">
												<strong>
													{property.option}
												</strong>
											</p>
										</div>
									</article>
								</div>
								<div class="tile is-parent is-vertical">
									<article class="tile is-child box">
										<p>Living-Index: </p>
										<div class="level-item">
											<p>
												<strong style={{ fontSize: 20 }}>
													{" "}
													{property.livingIndex}
												</strong>
											</p>
										</div>
									</article>
									<article class="tile is-child box">
										<p>City: </p>
										<div class="level-item">
											<p class="subtitle">
												<strong>
													{" "}
													{property.city}
												</strong>
											</p>
										</div>
									</article>
									<article class="tile is-child box">
										<p>Property Age: </p>
										<div class="level-item">
											<p class="subtitle">
												<strong>
													{" "}
													{property.propertyAge}{" "}
													year(s) old
												</strong>
											</p>
										</div>
									</article>
								</div>
							</div>
						</div>
					</div>
				</div>
				<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
					<div class="nav-menu is-active " style={{ alignItems: "center" }}>
						<a class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div id="navbarBasicExample" class="navbar-menu">
						<div class="navbar-start">
							<a href="#Description" style={{ padding: 20, color: "white" }}>
								DESCRIPTION
							</a>
							<a href="#Details" style={{ padding: 20, color: "white" }}>
								DETAILS
							</a>
							<a href="#Facilities" style={{ padding: 20, color: "white" }}>
								FACILITIES
							</a>
							<a href="#Location" style={{ padding: 20, color: "white" }}>
								LOCATION
							</a>
							<a href="#Reviews" style={{ padding: 20, color: "white" }}>
								REVIEWS
							</a>
						</div>
					</div>
				</nav>
				<div class="block">
					<section id="Description" class="hero is-light ">
						<div class="hero-body">
							<h1 class="title" style={{ fontFamily: "Pacifico" }}>
								Description:
							</h1>
							<p>{property.description}</p>
						</div>
					</section>
					<section id="Details" class="hero is-light" style={{ borderTop: "1px solid #ccd1d9" }}>
						<div class="hero-body">
							<h1 class="title" style={{ fontFamily: "Pacifico" }}>
								Details:
							</h1>
							<div class="container">
								<div class="content">
									<div class="level">
										<div class="level-left">
											<ul>
												<li>
													<strong>Plot Area:</strong>{" "}
													{property.totalSqft}{" "}
												</li>
												<li>
													<strong>Bathrooms:</strong>{" "}
													{property.noOfBathrooms}
												</li>
												<li>
													<strong>Bedrooms:</strong>{" "}
													{property.noOfBedrooms}
												</li>
											</ul>
										</div>
										<div class="level-center">
											<ul>
												<li>
													<strong>
														Property Age:
													</strong>{" "}
													{property.propertyAge}{" "}
													year(s)
												</li>
												<li>
													<strong>Price:</strong>{" "}
													{property.price}
												</li>
												<li>
													<strong>Pincode:</strong>{" "}
													380059
												</li>
											</ul>
										</div>
										<div class="level-right">
											<ul>
												<li>
													<strong>City:</strong>{" "}
													{property.city}
												</li>
												<li>
													<strong>
														Property Owner:
													</strong>{" "}
													Chandulal
												</li>
												<li>
													<strong>Contact:</strong>
													{property.ownerPhoneNumber}
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section id="Facilities" class="hero is-light" style={{ borderTop: "1px solid #ccd1d9" }}>
						<div class="hero-body">
							<h1 class="title" style={{ fontFamily: "Pacifico" }}>
								Aminent Facilities:
							</h1>
							<div class="content">
								<div class="level-left">
									<ul>
										<li>
											<strong>Swimming pool</strong>{" "}
										</li>
										<li>
											<strong>Basement Parking</strong>
										</li>
										<li>
											<strong>Gym</strong>{" "}
										</li>
									</ul>
								</div>
							</div>
						</div>
					</section>
					<section id="Location" class="hero is-light " style={{ borderTop: "1px solid #ccd1d9" }}>
						<div class="hero-body">
							<h1 class="title" style={{ fontFamily: "Pacifico" }}>
								Location:
							</h1>
							<div class="card-content is-flex" style={{ justifyContent: "center" }}>
								<ReactMapGL
									{...this.state.viewport}
									longitude={parseFloat(property.longitude)}
									latitude={parseFloat(property.latitude)}
									onViewportChange={(viewport) =>
										this.setState({ viewport })
									}
									mapStyle="mapbox://styles/mapbox/streets-v11"
									mapboxApiAccessToken="pk.eyJ1IjoiZGtwMTkwMyIsImEiOiJjazhya3F3YWMwM2tsM21wbWY3ZTE0OWo1In0.bspO79N0Vc0Fgu1b4bqU5A">
									<Marker
										longitude={parseFloat(
											property.longitude
										)}
										latitude={parseFloat(property.latitude)}>
										<span className="icon has-text-info">
											<i className="fa fa-home fa-lg" aria-hidden="true"/>
										</span>
									</Marker>
								</ReactMapGL>
							</div>
						</div>
					</section>
					<section id="Reviews" class="hero is-light" style={{ borderTop: "1px solid #ccd1d9" }}>
						<div class="hero-body">
							<h1 class="title" style={{ fontFamily: "Pacifico" }}>
								Reviews:
							</h1>
							<div class="column">
								{this.RenderReviews()}
                                {this.RenderButton()}
							</div>
                            <div class="block" style={{ textAlign: "center" }}>
                                {this.RenderWriteReview()}
                            </div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
})

export default withRouter(connect(mapStateToProps)(Extended));
