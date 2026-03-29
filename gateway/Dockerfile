# ── Stage 1: Build ──
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and POM first (layer caching for dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# ── Stage 2: Run ──
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Memory optimization for Render free tier (512MB RAM limit)
ENV JAVA_TOOL_OPTIONS="-Xmx384m -Xms384m"

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
