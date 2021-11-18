import numeral from 'numeral';
import React from 'react';
import {Td, Tr} from 'reactable';
import {Link} from 'react-router';
import Reactable from 'reactable';

import SimpleSortableTable from '../common/SimpleSortableTable';
import {getPrintableName, getProfilePageLinkForIdentity} from '../common/model/GerritUserdata';
import SelectedUsers from '../common/model/SelectedUsers';
import {formatPrintableDuration} from '../common/time/TimeUtils';

import TableCellHighlighter from './TableCellHighlighter';

function decimalComparator(left, right) {
    const lNum = +left;
    const rNum = +right;
    if (lNum > rNum) {
        return 1;
    } else if (lNum < rNum) {
        return -1;
    } else {
        return 0;
    }
}

export default class ReviewTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedUsers: this.props.selectedUsers,
            columnMetadata: this.getDefaultColumnMetadata()
        };
    }

    getDefaultColumnMetadata() {
        const overviewUserdata = this.props.overviewUserdata;
        // Use props as this is only called in constructor
        const selectedUsers = this.props.selectedUsers;

        return {
            'selected': {
                header: () => (
                    <input name='selectAll' type='checkbox'
                        checked={this.state.selectedUsers.isAllUsersSelected()}
                        onChange={this.onSelectAllCheckboxValueChanged.bind(this)} />
                ),
                cell: (record, index) => (
                    <Td key={'selected' + index} column='selected'>
                        <input data-identifier={record.identifier}
                               type='checkbox'
                               checked={this.state.selectedUsers.isUserSelected(record.identifier)}
                               onChange={() => this.onIdentityCheckboxValueChanged(record.identifier)} />
                    </Td>
                ),
            },
            'name': {
                sortFunction: Reactable.Sort.CaseInsensitive,
                description: 'The name of the user, as shown in Gerrit.',
                header: 'Name',
                cell: (record, index) => (
                    <Td key={'name' + index} column='name' value={getPrintableName(record.identity)}>
                        <Link to={getProfilePageLinkForIdentity(record.identifier)}>{getPrintableName(record.identity)}</Link>
                    </Td>
                ),
            },
            'allCommentsWritten': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'allCommentsWritten'),
                description: 'Number of review comments written to other people\'s commits by this user.',
                header: (<span>Comments<br/>written</span>),
                cell: (record, index) => (
                    <Td key={'allCommentsWritten' + index}
                        column='allCommentsWritten' style={this.computeCellStyle(index, 'allCommentsWritten')}>
                        {record.allCommentsWritten}
                    </Td>
                ),
            },
            'reviewCommentRatio': {
                sortFunction: decimalComparator,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'reviewCommentRatio'),
                description: 'The ratio of comments written by this user per a review request.',
                header: (<span>Comments<br/>/ review<br/>requests</span>),
                cell: (record, index) => (
                    <Td key={'reviewCommentRatio' + index} column='reviewCommentRatio'
                        value={record.reviewCommentRatio}
                        style={this.computeCellStyle(index, 'reviewCommentRatio')}>
                        {numeral(record.reviewCommentRatio).format('0.000')}
                    </Td>
                ),
            },
            'addedAsReviewerToCount': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'addedAsReviewerToCount'),
                description: 'Number of times this user was added as a reviewer.',
                header: (<span>Added as<br/>reviewer</span>),
                cell: (record, index) => (
                    <Td key={'addedAsReviewerToCount' + index} column='addedAsReviewerToCount'
                        style={this.computeCellStyle(index, 'addedAsReviewerToCount')}>
                        {record.addedAsReviewerToCount}
                    </Td>
                ),
            },
            'averageTimeToApprove': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'averageTimeToApprove')
                                 .setIsAscending(true)
                                 .setIgnoreZeroes(true),
                description: 'Average time the user\'s spends reviewing before approving.',
                header: (<span>Average time<br/>reviewing before approving</span>),
                cell: (record, index) => (
                    <Td key={'averageTimeToApprove' + index}
                        column='averageTimeToApprove' value={record.averageTimeToApprove}
                        style={this.computeCellStyle(index, 'averageTimeToApprove')}>
                        {formatPrintableDuration(record.averageTimeToApprove)}
                    </Td>
                ),
            },
 

            'TimeToApprove50p': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'TimeToApprove50p')
                                 .setIsAscending(true)
                                 .setIgnoreZeroes(true),
                description: '50p time the user\'s spends reviewing before approval.',
                header: (<span>50p time<br/>reviewing until approval</span>),
                cell: (record, index) => (
                    <Td key={'TimeToApprove50p' + index}
                        column='TimeToApprove50p' value={record.TimeToApprove50p}
                        style={this.computeCellStyle(index, 'TimeToApprove50p')}>
                        {formatPrintableDuration(record.TimeToApprove50p)}
                    </Td>
                ),
            }, 
            'TimeToApprove75p': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'TimeToApprove75p')
                                 .setIsAscending(true)
                                 .setIgnoreZeroes(true),
                description: '75p time the user\'s spends reviewing before approval.',
                header: (<span>75p time<br/>reviewing until approval</span>),
                cell: (record, index) => (
                    <Td key={'TimeToApprove75p' + index}
                        column='TimeToApprove75p' value={record.TimeToApprove75p}
                        style={this.computeCellStyle(index, 'TimeToApprove75p')}>
                        {formatPrintableDuration(record.TimeToApprove75p)}
                    </Td>
                ),
            }, 
            'TimeToComment50p': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'TimeToComment50p')
                                 .setIsAscending(true)
                                 .setIgnoreZeroes(true),
                description: '50p time the user\'s spends reviewing before commenting.',
                header: (<span>50p time<br/>reviewing before commenting</span>),
                cell: (record, index) => (
                    <Td key={'TimeToComment50p' + index}
                        column='TimeToComment50p' value={record.TimeToComment50p}
                        style={this.computeCellStyle(index, 'TimeToComment50p')}>
                        {formatPrintableDuration(record.TimeToComment50p)}
                    </Td>
                ),
            }, 
 
            'TimeToComment75p': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'TimeToComment75p')
                                 .setIsAscending(true)
                                 .setIgnoreZeroes(true),
                description: '75p time the user\'s spends reviewing before commenting.',
                header: (<span>75p time<br/>reviewing before commenting</span>),
                cell: (record, index) => (
                    <Td key={'TimeToComment75p' + index}
                        column='TimeToComment75p' value={record.TimeToComment75p}
                        style={this.computeCellStyle(index, 'TimeToComment75p')}>
                        {formatPrintableDuration(record.TimeToComment75p)}
                    </Td>
                ),
            }, 
                
            'averageTimeToComment': {
                sortFunction: Reactable.Sort.NumericInteger,
                highlighter: new TableCellHighlighter(overviewUserdata, selectedUsers, 'averageTimeToComment')
                                 .setIsAscending(true)
                                 .setIgnoreZeroes(true),
                description: 'Average time the user\'s spends reviewing before commenting.',
                header: (<span>Average time<br/>reviewing before commenting</span>),
                cell: (record, index) => (
                    <Td key={'averageTimeToComment' + index}
                        column='averageTimeToComment' value={record.averageTimeToComment}
                        style={this.computeCellStyle(index, 'averageTimeToComment')}>
                        {formatPrintableDuration(record.averageTimeToComment)}
                    </Td>
                ),
            },
 
        };
    }

    componentWillReceiveProps(nextProps) {
        Object.keys(this.state.columnMetadata).forEach(function(columnName) {
            const metadata = this.state.columnMetadata[columnName];
            if (metadata.highlighter) {
                metadata.highlighter.setOverviewUserdata(nextProps.overviewUserdata);
            }
        }.bind(this));

        if (!nextProps.selectedUsers.equals(this.state.selectedUsers)) {
            this.setState({
                selectedUsers: nextProps.selectedUsers,
            });
        }
    }

    onSelectAllCheckboxValueChanged() {
        const selectedUsers = this.state.selectedUsers;
        const isAllSelected = selectedUsers.isAllUsersSelected();
        const newSelectedUsers = isAllSelected ? selectedUsers.selectNone() : selectedUsers.selectAll();
        this.updateSelectedUsersForHighlighters(newSelectedUsers);

        this.setState({
            selectedUsers: newSelectedUsers,
        }, this.emitUserSelectionUpdate);
    }

    onIdentityCheckboxValueChanged(identifier) {
        const newSelectedUsers = this.state.selectedUsers.toggleSelection(identifier);
        this.updateSelectedUsersForHighlighters(newSelectedUsers);

        this.setState({
            selectedUsers: newSelectedUsers,
        }, this.emitUserSelectionUpdate);
    }

    updateSelectedUsersForHighlighters(selectedUsers) {
        Object.keys(this.state.columnMetadata).forEach(function(columnName) {
            const metadata = this.state.columnMetadata[columnName];
            if (metadata.highlighter) {
                metadata.highlighter.setSelectedUsers(selectedUsers);
            }
        }.bind(this));
    }

    emitUserSelectionUpdate() {
        if (this.props.onUserSelectionChanged) {
            this.props.onUserSelectionChanged(this.state.selectedUsers);
        }
    }

    computeCellStyle(index, columnName) {
        const metadata = this.state.columnMetadata[columnName];
        var style = {};
        if (metadata.highlighter) {
            const backgroundColor = metadata.highlighter.getHighlightColor(index);
            if (backgroundColor && backgroundColor.length > 0) {
                style.backgroundColor = backgroundColor;
            }
        }
        return style;
    }

    renderRow(index, overviewRecord) {
        const isUserSelected = this.state.selectedUsers.isUserSelected(overviewRecord.identifier);

        const selectionStyle = {
            color: isUserSelected ? '' : ReviewTable.COLOR_UNSELECTED
        };

        var rowCells = Object.keys(this.state.columnMetadata).map(function(columnName) {
            const metadata = this.state.columnMetadata[columnName];
            return metadata.cell(overviewRecord, index);
        }.bind(this));

        return (
            <Tr key={'r_' + index} style={selectionStyle}>
                {rowCells}
            </Tr>
        );
    }

    render() {
        return (
            <SimpleSortableTable
                columnMetadata={this.state.columnMetadata}
                rowData={this.props.overviewUserdata}
                rowRenderer={this.renderRow.bind(this)} />
        );
    }
}

ReviewTable.displayName = 'ReviewTable';

ReviewTable.defaultProps = {
    datasetOverview: {},
    overviewUserdata: [],
    onUserSelectionChanged: null
};

ReviewTable.propTypes = {
    datasetOverview: React.PropTypes.object,
    overviewUserdata: React.PropTypes.array,
    selectedUsers: React.PropTypes.instanceOf(SelectedUsers).isRequired,
    onUserSelectionChanged: React.PropTypes.func
};

ReviewTable.COLOR_UNSELECTED = '#cccccc';
