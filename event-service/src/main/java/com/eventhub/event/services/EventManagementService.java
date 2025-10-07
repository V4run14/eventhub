package com.eventhub.event.services;

import com.eventhub.event.dto.EventRequest;
import com.eventhub.event.dto.EventResponse;
import com.eventhub.event.entities.Event;
import com.eventhub.event.repositories.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventManagementService {

    private final EventRepository eventRepository;

    public EventManagementService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, String createdBy) {
        Event event = new Event();
        applyRequest(event, request);
        event.setCreatedBy(createdBy);
        return EventResponse.fromEntity(eventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id " + eventId + " not found"));
        return EventResponse.fromEntity(event);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id " + eventId + " not found"));
        applyRequest(event, request);
        return EventResponse.fromEntity(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event with id " + eventId + " not found");
        }
        eventRepository.deleteById(eventId);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> searchEvents(String city, String category) {
        List<Event> events = eventRepository.searchByCityAndCategory(normalizeFilter(city), normalizeFilter(category));
        return events.stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void applyRequest(Event event, EventRequest request) {
        if (request.getPriceMin() != null && request.getPriceMax() != null
                && request.getPriceMin() > request.getPriceMax()) {
            throw new InvalidEventStateException("priceMin cannot be greater than priceMax");
        }

        event.setTitle(sanitize(request.getTitle()));
        event.setCategory(sanitize(request.getCategory()));
        event.setVenue(sanitize(request.getVenue()));
        event.setCity(sanitize(request.getCity()));
        event.setDateTime(request.getDateTime());
        event.setSource(request.getSource().toUpperCase());
        event.setStatus(request.getStatus());
        event.setExternalId(sanitize(request.getExternalId()));
        event.setDescription(sanitize(request.getDescription()));
        event.setState(sanitize(request.getState()));
        event.setCountry(sanitize(request.getCountry()));
        event.setPriceMin(request.getPriceMin());
        event.setPriceMax(request.getPriceMax());
        event.setCapacity(request.getCapacity());
        event.setAvailableSeats(request.getAvailableSeats());
        event.setImageUrl(sanitize(request.getImageUrl()));
    }

    private String normalizeFilter(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String sanitize(String value) {
        return value == null ? null : value.trim();
    }
}
