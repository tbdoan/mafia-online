package com.example.Mafia.dao;

import com.example.Mafia.model.Player;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlayerDao {

    int insertPlayer(Player player);

    int insertTestCase();

    List<Player> selectAllPlayers();

    Optional<Player> selectPlayerByName(String name);

    int deletePlayerByName(String name);

    int updateStatusByName(String name);

    int updateRoleByName(String name, String updateRole);

    List<Player> assignRoles();

    Optional<Player> insertMafiaVote(String name);

    Optional<Player> insertNurseVote(String name);

    Optional<Player> insertDetectiveVote(String name);


}