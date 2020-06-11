/**
 * Model representing a player
 */
package com.example.Mafia.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;
import java.util.UUID;

public class Player {
    @NotBlank
    private final String name;
    private String role;
    private boolean alive;

    public Player(@JsonProperty("name") String name) {
        this.name = name;
        this.alive = true;
        this.role = "Civilian";
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public boolean isAlive() {
        return alive;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setAlive(boolean alive) {
        this.alive = alive;
    }
}
