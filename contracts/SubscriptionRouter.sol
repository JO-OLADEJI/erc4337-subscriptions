// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./RecurringPaymentsModule.sol";

error InvalidPrice(uint256 _subcriptionPrice);
error InvalidOperator(address _operator);

// - make it ownable
// - add a withdraw function callable by owner
// - implement a better mechanism to keep track of subscription payments
contract SubscriptionRouter {
    uint256 public price;
    address public immutable defaultOperator;
    mapping(address => uint256) public lastPayment;

    constructor(uint256 _price, address _defaultOperator) {
        price = _price;
        defaultOperator = _defaultOperator;
    }

    function extendSubscription() external payable {
        if (msg.value != price) revert InvalidPrice(price);
        lastPayment[msg.sender] = block.timestamp;
    }

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
}
