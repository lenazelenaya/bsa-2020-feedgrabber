package com.feed_grabber.core.user.model;

import com.feed_grabber.core.image.model.Image;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.search.annotations.*;
import org.hibernate.search.annotations.Index;

import javax.persistence.*;
import java.util.UUID;

@Indexed
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Field
    @Analyzer(definition = "autocompleteEdgeAnalyzer")
    @Column(name = "first_name", length = 30)
    private String firstName;

    @Field
    @Analyzer(definition = "autocompleteEdgeAnalyzer")
    @Column(name = "last_name", length = 30)
    private String lastName;

    @Field
    @Analyzer(definition = "autocompleteEdgeAnalyzer")
    @Column(name = "phone_number")
    private String phoneNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "avatar_id", referencedColumnName = "id")
    private Image avatar;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public UserProfile(User user) {
        this.user = user;
    }
}
