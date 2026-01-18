// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MessageStorage {
    struct Message {
        address from;
        string to;
        string encryptedData;
        uint256 timestamp;
        bytes32 messageHash;
    }

    mapping(uint256 => Message) public messages;
    mapping(address => uint256[]) public userMessages;
    uint256 public totalMessages;

    event MessageStored(
        uint256 indexed messageId,
        address indexed from,
        string to,
        uint256 timestamp
    );

    function storeMessage(string memory _to, string memory _encryptedData) public returns (uint256) {
        uint256 messageId = totalMessages;
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _to, _encryptedData, block.timestamp));

        messages[messageId] = Message({
            from: msg.sender,
            to: _to,
            encryptedData: _encryptedData,
            timestamp: block.timestamp,
            messageHash: messageHash
        });

        userMessages[msg.sender].push(messageId);

        totalMessages++;

        emit MessageStored(messageId, msg.sender, _to, block.timestamp);

        return messageId;
    }

    function getMessage(uint256 _messageId) public view returns (
        address from,
        string memory to,
        string memory encryptedData,
        uint256 timestamp,
        bytes32 messageHash
    ) {
        Message memory message = messages[_messageId];
        return (
            message.from,
            message.to,
            message.encryptedData,
            message.timestamp,
            message.messageHash
        );
    }

    function getUserMessages(address _user) public view returns (uint256[] memory) {
        return userMessages[_user];
    }

    function getTotalMessages() public view returns (uint256) {
        return totalMessages;
    }
}
