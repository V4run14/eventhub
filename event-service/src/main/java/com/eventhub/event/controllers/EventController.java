package com.eventhub.event.controllers;

import com.eventhub.event.dto.EventRequest;
import com.eventhub.event.dto.EventResponse;
import com.eventhub.event.services.EventManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventManagementService eventService;

    public EventController(EventManagementService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request,
                                                     Authentication authentication) {
        String createdBy = authentication.getName();
        EventResponse response = eventService.createEvent(request, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<EventResponse> listEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public EventResponse getEvent(@PathVariable("id") Long id) {
        return eventService.getEventById(id);
    }

    @PutMapping("/{id}")
    public EventResponse updateEvent(@PathVariable("id") Long id,
                                     @Valid @RequestBody EventRequest request) {
        return eventService.updateEvent(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable("id") Long id) {
        eventService.deleteEvent(id);
    }

    @GetMapping("/search")
    public List<EventResponse> searchEvents(@RequestParam(value = "city", required = false) String city,
                                            @RequestParam(value = "category", required = false) String category) {
        return eventService.searchEvents(city, category);
    }
}
