package com.eventhub.event.controllers;

import com.eventhub.event.dto.EventRequest;
import com.eventhub.event.dto.EventResponse;
import com.eventhub.event.entities.EventStatus;
import com.eventhub.event.security.JwtTokenService;
import com.eventhub.event.services.EventManagementService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
@AutoConfigureMockMvc(addFilters = false)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventManagementService eventManagementService;

    @MockBean
    private JwtTokenService jwtTokenService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createEventReturnsCreatedResponse() throws Exception {
        EventResponse response = sampleResponse(5L, "Concert Night");
        when(eventManagementService.createEvent(any(EventRequest.class), eq("alice"))).thenReturn(response);

        mockMvc.perform(post("/events")
                        .with(withAuthentication("alice"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{" +
                                "\"title\":\"Concert Night\"," +
                                "\"category\":\"Music\"," +
                                "\"venue\":\"Main Hall\"," +
                                "\"city\":\"Raleigh\"," +
                                "\"dateTime\":\"2025-05-10T20:00:00\"," +
                                "\"source\":\"LOCAL\"," +
                                "\"status\":\"UPCOMING\"" +
                                "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", equalTo(5)))
                .andExpect(jsonPath("$.title", equalTo("Concert Night")))
                .andExpect(jsonPath("$.createdBy", equalTo("alice")));

        verify(eventManagementService).createEvent(any(EventRequest.class), eq("alice"));
    }

    @Test
    void listEventsReturnsCollection() throws Exception {
        when(eventManagementService.getAllEvents()).thenReturn(List.of(
                sampleResponse(1L, "Expo"),
                sampleResponse(2L, "Meetup")
        ));

        mockMvc.perform(get("/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", equalTo("Expo")))
                .andExpect(jsonPath("$[1].title", equalTo("Meetup")));
    }

    @Test
    void getEventReturnsSingleResource() throws Exception {
        when(eventManagementService.getEventById(9L)).thenReturn(sampleResponse(9L, "Tech Conference"));

        mockMvc.perform(get("/events/9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(9)))
                .andExpect(jsonPath("$.title", equalTo("Tech Conference")));
    }

    @Test
    void updateEventDelegatesToService() throws Exception {
        when(eventManagementService.updateEvent(eq(9L), any(EventRequest.class)))
                .thenReturn(sampleResponse(9L, "Updated Title"));

        mockMvc.perform(put("/events/9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{" +
                                "\"title\":\"Updated Title\"," +
                                "\"category\":\"Music\"," +
                                "\"venue\":\"Main Hall\"," +
                                "\"city\":\"Raleigh\"," +
                                "\"dateTime\":\"2025-05-10T20:00:00\"," +
                                "\"source\":\"LOCAL\"," +
                                "\"status\":\"UPCOMING\"" +
                                "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", equalTo("Updated Title")));

        verify(eventManagementService).updateEvent(eq(9L), any(EventRequest.class));
    }

    @Test
    void deleteEventReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/events/4"))
                .andExpect(status().isNoContent());

        verify(eventManagementService).deleteEvent(4L);
    }

    @Test
    void searchEventsPassesQueryParameters() throws Exception {
        when(eventManagementService.searchEvents("Raleigh", "Music"))
                .thenReturn(List.of(sampleResponse(3L, "Music Fest")));

        mockMvc.perform(get("/events/search")
                        .param("city", "Raleigh")
                        .param("category", "Music"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", equalTo("Music Fest")));

        verify(eventManagementService).searchEvents("Raleigh", "Music");
    }

    private RequestPostProcessor withAuthentication(String username) {
        return request -> {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, "password");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.setUserPrincipal(authentication);
            return request;
        };
    }

    private EventResponse sampleResponse(long id, String title) {
        EventResponse response = new EventResponse();
        response.setId(id);
        response.setTitle(title);
        response.setCategory("Music");
        response.setVenue("Main Hall");
        response.setCity("Raleigh");
        response.setDateTime(LocalDateTime.of(2025, 5, 10, 20, 0));
        response.setSource("LOCAL");
        response.setCreatedBy("alice");
        response.setStatus(EventStatus.UPCOMING);
        response.setPriceMin(10.0);
        response.setPriceMax(50.0);
        return response;
    }
}
