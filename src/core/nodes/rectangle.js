/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = require("scenegraph");

const $ = require("../../utils/utils");
const { ExportNode } = require("./exportnode");
const NodeUtils = require("../../utils/nodeutils");
const { getColorOrDecorationParam, getDecorationParam } = require("../serialize/decorations");
const PropType = require("../proptype");
const { ParamType } = require("../parameter");

class Rectangle extends ExportNode {
	static create(xdNode, ctx) {
		if (xdNode instanceof xd.Rectangle || xdNode instanceof xd.Ellipse) {
			return new Rectangle(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);

		if (xdNode.fill instanceof xd.ImageFill) {
			this.addParam(ParamType.IMAGE_FILL, "fill", xdNode.fill,
				NodeUtils.getProp(xdNode, PropType.IMAGE_PARAM_NAME));
		} else {
			this.addParam(ParamType.COLOR, "fill", xdNode.fill)
		}
		this.addParam(ParamType.COLOR, "stroke", xdNode.stroke);
		this.addParam(ParamType.BOOL, "strokeEnabled", xdNode.strokeEnabled);
	}

	_serialize(serializer, ctx) {
		let o = this.xdNode, isRect = o instanceof xd.Rectangle;
		let w = $.fix(isRect ? o.width : o.radiusX * 2);
		let h = $.fix(isRect ? o.height : o.radiusY * 2);
		let c = isRect ? getColorOrDecorationParam(o, serializer, ctx, this.parameters) : 
			getDecorationParam(o, serializer, ctx, this.parameters);
		return `Container(width: ${w}, height: ${h}, ${c})`;
	}

}
exports.Rectangle = Rectangle;
