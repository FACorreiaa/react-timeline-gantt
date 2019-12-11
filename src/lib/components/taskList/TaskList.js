import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';

export class VerticalLine extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div
				className='timeLine-main-data-verticalLine'
				style={{ left: this.props.left }}
			/>
		);
	}
}

export class TaskRow extends Component {
	constructor(props) {
		super(props);
	}

	onChange = value => {
		if (this.props.onUpdateTask) {
			this.props.onUpdateTask(this.props.item, { name: value });
		}
	};

	renderSideTaskRow() {
		const {
			renderSideTaskRow,
			label,
			index,
			nonEditable,
			onSelectItem,
			top,
			itemHeight
		} = this.props;
		if (renderSideTaskRow) {
			return renderSideTaskRow({ label, index, onChange: this.onChange });
		} else if (nonEditable) {
			return (
				<div tabIndex={index} style={{ width: '100%' }}>
					{label}
				</div>
			);
		}
		return (
			<ContentEditable value={label} index={index} onChange={this.onChange} />
		);
	}

	render() {
		const { onSelectItem, top, itemheight, item } = this.props;
		return (
			<div
				className='timeLine-side-task-row'
				style={{
					...Config.values.taskList.task.style,
					top: top,
					height: itemheight
				}}
				onClick={e => onSelectItem(item)}>
				{this.renderSideTaskRow()}
			</div>
		);
	}
}

export default class TaskList extends Component {
	constructor(props) {
		super(props);
	}

	getContainerStyle(rows) {
		let new_height = rows > 0 ? rows * this.props.itemheight : 10;
		return { height: new_height };
	}

	renderTaskRow(data) {
		let result = [];
		for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
			let item = data[i];
			if (!item) break;
			result.push(
				<TaskRow
					key={i}
					index={i}
					item={item}
					label={item.name}
					top={i * this.props.itemheight}
					itemheight={this.props.itemheight}
					isSelected={this.props.selectedItem == item}
					onUpdateTask={this.props.onUpdateTask}
					onSelectItem={this.props.onSelectItem}
					nonEditable={this.props.nonEditable}
					renderSideTaskRow={this.props.renderSideTaskRow}
				/>
			);
		}
		return result;
	}

	doScroll = () => {
		this.props.onScroll(this.refs.taskViewPort.scrollTop);
	};

	render() {
		let data = this.props.data ? this.props.data : [];
		this.containerStyle = this.getContainerStyle(data.length);
		return (
			<div className='timeLine-side'>
				<div
					className='timeLine-side-title'
					style={Config.values.taskList.title.style}>
					<div>{Config.values.taskList.title.label}</div>
				</div>
				<div
					ref='taskViewPort'
					className='timeLine-side-task-viewPort'
					onScroll={this.doScroll}>
					<div
						className='timeLine-side-task-container'
						style={this.containerStyle}>
						{this.renderTaskRow(data)}
					</div>
				</div>
			</div>
		);
	}
}
