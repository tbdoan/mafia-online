/**
 * Business logic
 */
package com.example.Mafia.service;

import com.example.Mafia.dao.PlayerDao;
import com.example.Mafia.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlayerService {
    private final PlayerDao playerDao;

    @Autowired
    public PlayerService(@Qualifier("realDao") PlayerDao playerDao) {
        this.playerDao = playerDao;
    }

    public int addPlayer(Player player) {
        return playerDao.insertPlayer(player);
    }

    public List<Player> getAllPlayers() {
        return playerDao.selectAllPlayers();
    }

    public Optional<Player> getPlayerByName(String name) {
        return playerDao.selectPlayerByName(name);
    }

    public int deletePlayer(String name) {
        return playerDao.deletePlayerByName(name);
    }

    public int updatePlayerRole(String name, String updateRole) {
        return playerDao.updateRoleByName(name, updateRole);
    }

    public int updatePlayerStatus(String name) {
        return playerDao.updateStatusByName(name);
    }

    public List<Player> assignRoles() {
        return playerDao.assignRoles();
    }
}
