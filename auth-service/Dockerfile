# Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /workspace

COPY pom.xml ./
COPY auth-service/pom.xml auth-service/pom.xml
COPY auth-service/src auth-service/src
COPY event-service/pom.xml event-service/pom.xml
COPY event-service/src event-service/src

RUN mvn -pl auth-service -am -DskipTests package

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /workspace/auth-service/target/auth-service-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
