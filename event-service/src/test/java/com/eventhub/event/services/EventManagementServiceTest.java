package com.eventhub.event.services;

import com.eventhub.event.dto.EventRequest;
import com.eventhub.event.dto.EventResponse;
import com.eventhub.event.entities.Event;
import com.eventhub.event.entities.EventStatus;
import com.eventhub.event.repositories.EventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventManagementServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventManagementService eventManagementService;

    private final ArgumentCaptor<Event> eventCaptor = ArgumentCaptor.forClass(Event.class);

    @Test
    void createEventPersistsSanitizedEvent() {
        EventRequest request = buildRequest();
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> {
            Event saved = invocation.getArgument(0);
            saved.setId(99L);
            return saved;
        });

        EventResponse response = eventManagementService.createEvent(request, "creator@example.com");

        verify(eventRepository).save(eventCaptor.capture());
        Event persisted = eventCaptor.getValue();

        assertThat(persisted.getCreatedBy()).isEqualTo("creator@example.com");
        assertThat(persisted.getSource()).isEqualTo("LOCAL");
        assertThat(persisted.getTitle()).isEqualTo("Concert Night");
        assertThat(persisted.getCity()).isEqualTo("Raleigh");
        assertThat(persisted.getDescription()).isEqualTo("Live music");
        assertThat(response.getId()).isEqualTo(99L);
    }

    @Test
    void createEventRejectsInvalidPriceRange() {
        EventRequest request = buildRequest();
        request.setPriceMin(150.0);
        request.setPriceMax(100.0);

        assertThatThrownBy(() -> eventManagementService.createEvent(request, "user"))
                .isInstanceOf(InvalidEventStateException.class)
                .hasMessageContaining("priceMin");

        verify(eventRepository, never()).save(any());
    }

    @Test
    void getEventByIdReturnsResponse() {
        Event stored = sampleEvent(7L, "Tech Conference");
        when(eventRepository.findById(7L)).thenReturn(Optional.of(stored));

        EventResponse response = eventManagementService.getEventById(7L);

        assertThat(response.getId()).isEqualTo(7L);
        assertThat(response.getTitle()).isEqualTo("Tech Conference");
        assertThat(response.getCreatedBy()).isEqualTo("imported@system");
    }

    @Test
    void getEventByIdThrowsWhenMissing() {
        when(eventRepository.findById(55L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventManagementService.getEventById(55L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("55");
    }

    @Test
    void updateEventAppliesRequestChanges() {
        Event existing = sampleEvent(11L, "Old Title");
        when(eventRepository.findById(11L)).thenReturn(Optional.of(existing));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));
        EventRequest request = buildRequest();
        request.setTitle("  Updated Title  ");

        EventResponse response = eventManagementService.updateEvent(11L, request);

        verify(eventRepository).save(eventCaptor.capture());
        Event persisted = eventCaptor.getValue();

        assertThat(persisted.getTitle()).isEqualTo("Updated Title");
        assertThat(response.getTitle()).isEqualTo("Updated Title");
        assertThat(persisted.getSource()).isEqualTo("LOCAL");
    }

    @Test
    void deleteEventRemovesExistingRecord() {
        when(eventRepository.existsById(3L)).thenReturn(true);

        eventManagementService.deleteEvent(3L);

        verify(eventRepository).deleteById(3L);
    }

    @Test
    void deleteEventThrowsWhenMissing() {
        when(eventRepository.existsById(4L)).thenReturn(false);

        assertThatThrownBy(() -> eventManagementService.deleteEvent(4L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("4");
    }

    @Test
    void searchEventsDelegatesWithNormalizedFilters() {
        Event event = sampleEvent(1L, "Food Fair");
        when(eventRepository.searchByCityAndCategory(any(), any())).thenReturn(List.of(event));

        List<EventResponse> results = eventManagementService.searchEvents("  Raleigh  ", " ");

        assertThat(results).hasSize(1);
        verify(eventRepository).searchByCityAndCategory(eq("Raleigh"), eq(null));
    }

    @Test
    void getAllEventsMapsEntitiesToResponses() {
        when(eventRepository.findAll()).thenReturn(List.of(sampleEvent(1L, "Expo"), sampleEvent(2L, "Meetup")));

        List<EventResponse> responses = eventManagementService.getAllEvents();

        assertThat(responses).extracting(EventResponse::getTitle).containsExactly("Expo", "Meetup");
    }

    private EventRequest buildRequest() {
        EventRequest request = new EventRequest();
        request.setTitle("  Concert Night ");
        request.setCategory(" Music ");
        request.setVenue(" Main Hall ");
        request.setCity(" Raleigh ");
        request.setDateTime(LocalDateTime.of(2025, 5, 10, 20, 0));
        request.setSource("local");
        request.setStatus(EventStatus.UPCOMING);
        request.setExternalId(" ext-123 ");
        request.setDescription(" Live music ");
        request.setState(" NC ");
        request.setCountry(" USA ");
        request.setPriceMin(50.0);
        request.setPriceMax(120.0);
        request.setCapacity(500);
        request.setAvailableSeats(450);
        request.setImageUrl(" https://example.com/image.jpg ");
        return request;
    }

    private Event sampleEvent(Long id, String title) {
        Event event = new Event();
        event.setId(id);
        event.setTitle(title);
        event.setCategory("Tech");
        event.setVenue("Convention Center");
        event.setCity("Raleigh");
        event.setDateTime(LocalDateTime.of(2025, 3, 15, 9, 0));
        event.setSource("TICKETMASTER");
        event.setCreatedBy("imported@system");
        event.setStatus(EventStatus.UPCOMING);
        event.setDescription("Annual event");
        event.setState("NC");
        event.setCountry("USA");
        event.setPriceMin(10.0);
        event.setPriceMax(100.0);
        event.setCapacity(2000);
        event.setAvailableSeats(1500);
        event.setImageUrl("https://example.com/event.jpg");
        return event;
    }
}
