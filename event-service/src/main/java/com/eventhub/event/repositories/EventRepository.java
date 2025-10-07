package com.eventhub.event.repositories;

import com.eventhub.event.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e " +
           "WHERE (:city IS NULL OR LOWER(e.city) = LOWER(:city)) " +
           "AND (:category IS NULL OR LOWER(e.category) = LOWER(:category))")
    List<Event> searchByCityAndCategory(@Param("city") String city, @Param("category") String category);
}
