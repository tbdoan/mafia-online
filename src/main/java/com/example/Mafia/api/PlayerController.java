/**
 * API that handles HTTP requests
 */
package com.example.Mafia.api;

import com.example.Mafia.model.Player;
import com.example.Mafia.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/player")
@CrossOrigin(origins = "*")
public class PlayerController {
    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }
    
    @PostMapping
    public void addPerson(@Valid @NonNull @RequestBody Player player) {
        playerService.addPlayer(player);
    }

    @GetMapping()
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping(headers = "action=assign-roles")
    public List<Player> assignRoles() {
        return playerService.assignRoles();
    }

    @GetMapping(path = "{name}")
    public Player getPlayerByName(@PathVariable("name") String name) {
        return playerService.getPlayerByName(name)
                .orElse(null);
    }

    @DeleteMapping(path = "{name}")
    public void deletePlayerByName(@PathVariable("name") String name) {
        playerService.deletePlayer(name);
    }

    @PutMapping(path = "{name}", headers = "action=update-role")
    public void updatePlayerRole(@PathVariable("name") String name,
                                 @NonNull @RequestBody String updateRole) {
        playerService.updatePlayerRole(name, updateRole);
    }

    @PutMapping(path = "{name}", headers = "action=update-status")
    public void updatePlayerStatus(@PathVariable("name") String name) {
        playerService.updatePlayerStatus(name);
    }



}
