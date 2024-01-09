// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.17;

import {Enum} from "@biconomy-devx/smart-account-contracts/contracts/smart-account/common/Enum.sol";

interface ISmartAccount {
    /**
     * @dev Allows a Module to execute a wallet transaction without any further confirmations and returns data
     * @param to Destination address of module transaction.
     * @param value Ether value of module transaction.
     * @param data Data payload of module transaction.
     * @param operation Operation type of module transaction.
     */
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) external returns (bool success, bytes memory returnData);
}
