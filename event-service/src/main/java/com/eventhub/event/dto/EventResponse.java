package com.eventhub.event.dto;

import com.eventhub.event.entities.Event;
import com.eventhub.event.entities.EventStatus;

import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String title;
    private String category;
    private String venue;
    private String city;
    private LocalDateTime dateTime;
    private String source;
    private String createdBy;
    private EventStatus status;
    private String externalId;
    private String description;
    private String state;
    private String country;
    private Double priceMin;
    private Double priceMax;
    private Integer capacity;
    private Integer availableSeats;
    private String imageUrl;

    public static EventResponse fromEntity(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setCategory(event.getCategory());
        response.setVenue(event.getVenue());
        response.setCity(event.getCity());
        response.setDateTime(event.getDateTime());
        response.setSource(event.getSource());
        response.setCreatedBy(event.getCreatedBy());
        response.setStatus(event.getStatus());
        response.setExternalId(event.getExternalId());
        response.setDescription(event.getDescription());
        response.setState(event.getState());
        response.setCountry(event.getCountry());
        response.setPriceMin(event.getPriceMin());
        response.setPriceMax(event.getPriceMax());
        response.setCapacity(event.getCapacity());
        response.setAvailableSeats(event.getAvailableSeats());
        response.setImageUrl(event.getImageUrl());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Double getPriceMin() {
        return priceMin;
    }

    public void setPriceMin(Double priceMin) {
        this.priceMin = priceMin;
    }

    public Double getPriceMax() {
        return priceMax;
    }

    public void setPriceMax(Double priceMax) {
        this.priceMax = priceMax;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
