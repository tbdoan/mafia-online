package com.example.Mafia.dao;

import com.example.Mafia.model.Player;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlayerDao {

    int insertPlayer(Player player);

    List<Player> selectAllPlayers();

    Optional<Player> selectPlayerByName(String name);

    int deletePlayerByName(String name);

    int updateStatusByName(String name);

    int updateRoleByName(String name, String updateRole);

    List<Player> assignRoles();
}