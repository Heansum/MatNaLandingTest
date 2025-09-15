package com.nagune.restaurantplatform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tags")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tag_type")
    private TagType tagType;
    
    @Column(name = "usage_count")
    @Builder.Default
    private Integer usageCount = 0;
    
    @Column(name = "is_trending")
    @Builder.Default
    private Boolean isTrending = false;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private List<Post> posts = new ArrayList<>();
    
    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private List<Restaurant> restaurants = new ArrayList<>();
    
    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private List<UserPreference> userPreferences = new ArrayList<>();
    
    public enum TagType {
        CUISINE,        // 한식, 중식, 일식, 양식 등
        MOOD,           // 데이트, 가족, 혼밥 등
        PRICE,          // 저렴한, 비싼 등
        DIETARY,        // 채식, 할랄, 글루텐프리 등
        FEATURE,        // 24시간, 배달, 포장 등
        LOCATION,       // 강남, 홍대, 이태원 등
        CUSTOM          // 사용자 정의 태그
    }
}
