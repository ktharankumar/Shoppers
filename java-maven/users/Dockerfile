# ---- build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .

# 4. Download dependencies (this layer is cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# 5. NOW copy your actual source code
COPY src ./src

# 6. Package the application
RUN mvn package -DskipTests


# ---- runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
