// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (finance/Vesting.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is Ownable {

    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);


    uint256 public startTime;
    uint256 private oneDay = 300 seconds;
    uint256 private totalDays = 609;
    uint256 private _totalShares;
    
    IERC20 token;
    mapping(address => uint256) private _shares;

    address[] private _payees;

    mapping(IERC20 => uint256) private _erc20TotalReleased;
    mapping(IERC20 => mapping(address => uint256)) private _erc20Released;

    

    
    constructor(address[] memory payees, uint256[] memory shares_ , IERC20 _token ,
                 uint256 _time ) payable {

        require(payees.length == shares_.length, "Vesting: payees and shares length mismatch");
        require(payees.length > 0, "Vesting: no payees");
        
        
        setToken(_token);
        startTime = block.timestamp + _time;

        for (uint256 i = 0; i < payees.length; i++) {
            _addPayee(payees[i], shares_[i]);
        }
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
    }

   
    receive() external payable virtual {
        emit PaymentReceived(_msgSender(), msg.value);
    }

    
    function totalShares() public view returns (uint256) {
        return _totalShares;
    }

    
    function totalReleased() public view returns (uint256) {
        return _erc20TotalReleased[token];
    }

    
    function shares(address account) public view returns (uint256) {
        return _shares[account];
    }


    
    function released(address account) public view returns (uint256) {
        return _erc20Released[token][account];
    }

    
    function payee(uint256 index) public view returns (address) {
        return _payees[index];
    }

    function daysDifference() public view returns(uint256){
        return (block.timestamp - startTime) / oneDay;
    }

    function lockedBalance(address account) public view returns(uint256) {
       // uint256 totalReceived = (_shares[account]  / totalDays ) * totalDays;
        uint256 payment = (_shares[account]  / totalDays ) * totalDays;
        return payment;
    }

    
    function release(address account) public virtual {
        require(_shares[account] > 0, "Vesting: account has no shares");

        uint256 payment = _pending(account);

        require(payment != 0, "Vesting: account is not due payment");

        _erc20Released[token][account] += payment;
        _erc20TotalReleased[token] += payment;

        SafeERC20.safeTransfer(token, account, payment);
        emit ERC20PaymentReleased(token, account, payment);
    }

    
    function _pendingPayment(
        address account,
        uint256 totalReceived
    ) private view returns (uint256) {
        return totalReceived  - released(account);
    }

    function _pending(
        address account
    ) public view returns (uint256) {
        uint256 Days = daysDifference();
        if(daysDifference() > totalDays)
        Days = totalDays;
        uint256 totalReceived = (_shares[account]  / totalDays ) * Days;
        uint256 payment = _pendingPayment(account, totalReceived);
        return payment;
    }

    
    function _addPayee(address account, uint256 shares_) public onlyOwner {
        require(account != address(0), "Vesting: account is the zero address");
        require(shares_ > 0, "Vesting: shares are 0");
        require(_shares[account] == 0, "Vesting: account already has shares");

        _payees.push(account);
        _shares[account] = shares_;
        _totalShares = _totalShares + shares_;
        emit PayeeAdded(account, shares_);
    }
}
