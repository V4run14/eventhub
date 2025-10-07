# Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /workspace

COPY pom.xml ./
COPY auth-service/pom.xml auth-service/pom.xml
COPY auth-service/src auth-service/src
COPY event-service/pom.xml event-service/pom.xml
COPY event-service/src event-service/src

RUN mvn -pl event-service -am -DskipTests package

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /workspace/event-service/target/event-service-*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
