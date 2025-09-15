package com.nagune.restaurantplatform.config;

import io.supabase.SupabaseClient;
import io.supabase.SupabaseClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SupabaseConfig {
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;
    
    @Value("${supabase.service-role-key}")
    private String supabaseServiceRoleKey;
    
    @Bean
    public SupabaseClient supabaseClient() {
        return SupabaseClientBuilder.builder()
                .url(supabaseUrl)
                .anonKey(supabaseAnonKey)
                .build();
    }
    
    @Bean
    public SupabaseClient supabaseServiceClient() {
        return SupabaseClientBuilder.builder()
                .url(supabaseUrl)
                .serviceRoleKey(supabaseServiceRoleKey)
                .build();
    }
}
