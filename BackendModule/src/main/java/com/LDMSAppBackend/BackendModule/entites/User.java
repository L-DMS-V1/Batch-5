package com.LDMSAppBackend.BackendModule.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name="User")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer accountId;

    private String accountName;

    @Column(name="user_name",nullable = false,unique = true,length = 50)
    private String userName;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name="email_id",nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String role;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL,mappedBy = "user")
    private Employee employee;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL,mappedBy = "user")
    private Manager manager;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL,mappedBy = "user")
    private Admin admin;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_"+role.toUpperCase()));
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }
}
