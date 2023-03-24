// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract SciGovernor is Governor, GovernorCountingSimple, GovernorVotes, GovernorTimelockControl {
    uint256 private proposalThresholdNumber;
    uint256 private votingDelayNumber;
    uint256 private votingPeriodNumber;
    uint256 private tokenDecimals;
    uint256 private quorumNumber;
    constructor(
        IVotes _token, 
        string memory _name, 
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorum,
        uint256 _tokenDecimals,
        TimelockController _timelock
    )
        Governor(_name)
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
    {
        proposalThresholdNumber = _proposalThreshold;
        votingDelayNumber = _votingDelay;
        votingPeriodNumber = _votingPeriod;
        quorumNumber = _quorum;
        tokenDecimals = _tokenDecimals;
    }

    function votingDelay() public view override returns (uint256) {
        return votingDelayNumber;
    }

    function votingPeriod() public view override returns (uint256) {
        return votingPeriodNumber;
    }

    function quorum(uint256 blockNumber) public view override returns (uint256) {
        return quorumNumber*(10**tokenDecimals);
    }

    function proposalThreshold() public view override returns (uint256) {
        return proposalThresholdNumber*(10**tokenDecimals);
    }

    // The following functions are overrides required by Solidity.

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
