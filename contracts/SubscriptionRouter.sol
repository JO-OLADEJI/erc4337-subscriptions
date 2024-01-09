// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./RecurringPaymentsModule.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error InvalidPrice(uint256 _subcriptionPrice);
error InvalidOperator(address _operator);

/// @title A subscription router for a recurring payment plugin to an ERC4337-compatible smart account
/// @notice This contract is a PoC and should be adequately tested before mainnet use
contract SubscriptionRouter is Ownable {
    uint256 public price;
    address public immutable defaultOperator;

    mapping(address => uint256) public lastPayment;

    /// @notice Called at the time of contract creation
    /// @param _price Aamount paid for every subscription renewal
    /// @param _defaultOperator Arbitrary address to extend subscriptions for smart accounts
    /// @dev _defaultOperator cannot be changed after contract creation
    constructor(uint256 _price, address _defaultOperator) {
        price = _price;
        defaultOperator = _defaultOperator;
    }

    /// @notice Called every time a subscription is renewed
    /// @dev .call(ed) internally by SmartAccount.execute_ncC
    function extendSubscription() external payable {
        if (msg.value != price) revert InvalidPrice(price);
        lastPayment[msg.sender] = block.timestamp;
    }

    /// @notice Subscription renewal called manually by default Operator
    /// @param _payModule Contract address to Recurring Payment Module
    /// @param _subHash Subscription hash generated at time of initial subscription agreement
    /// @param _subscriber Address of smart account subscriber
    /// @dev call flow: this -> PayModule -> smart account -> this(extendSubscription)
    function extendSubscriptionByOperator(
        address _payModule,
        bytes32 _subHash,
        address _subscriber
    ) external {
        if (msg.sender != defaultOperator)
            revert InvalidOperator(defaultOperator);
        RecurringPaymentsModule(_payModule).executeRecurringPayment(
            _subHash,
            _subscriber
        );
    }

    /// @notice Allows for withdrawals by contract owner
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
