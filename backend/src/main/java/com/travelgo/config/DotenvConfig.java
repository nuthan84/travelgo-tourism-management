package com.travelgo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Automatically detects and loads key-value pairs from .env or backend/.env
 * into both System properties and Spring Environment property sources before
 * the application context or DataSource is initialized.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DotenvConfig implements EnvironmentPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(DotenvConfig.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        loadEnvironment(environment);
    }

    public static void loadSystemProperties() {
        loadEnvironment(null);
    }

    private static synchronized void loadEnvironment(ConfigurableEnvironment environment) {
        File[] candidates = new File[] {
            new File(".env"),
            new File("backend/.env"),
            new File("../backend/.env"),
            new File("../.env")
        };

        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                Map<String, Object> envProps = new HashMap<>();
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String val = line.substring(eqIdx + 1).trim();
                            if ((val.startsWith("\"") && val.endsWith("\"")) ||
                                (val.startsWith("'") && val.endsWith("'"))) {
                                val = val.substring(1, val.length() - 1);
                            }
                            envProps.put(key, val);

                            // Only populate System property if not explicitly set by OS or JVM -D arg
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, val);
                            }
                        }
                    }
                    if (environment != null && !envProps.isEmpty()) {
                        environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", envProps));
                    }
                    log.info("Loaded {} environment properties from {}", envProps.size(), file.getPath());
                } catch (IOException e) {
                    log.warn("Could not read .env file at {}: {}", file.getPath(), e.getMessage());
                }
                break;
            }
        }
    }
}
