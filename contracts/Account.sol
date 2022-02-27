//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Account {
    uint256 private account;

    function getBalance() public view returns (uint256) {
        return account;
    }

    receive() external payable {
        account += msg.value;
    }

    fallback() external payable {}
}
