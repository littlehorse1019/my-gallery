require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转为图片路径信息
imageDatas = (function getImageUrl(arr) {
    for (let i = 0, j = arr.length; i < j; i++) {
        let singleImagesData = arr[i];
        singleImagesData.imageUrl = require('../images/' + singleImagesData.fileName);
        arr[i] = singleImagesData;
    }
    return arr;
})(imageDatas);

/**
 * 获取区间内的一个随机值
 */
let getRangeRandom = (low, high) =>  Math.floor(Math.random() * (high - low) + low );


/**
 *  随机生成一个0-30度正负值角度
 */
let get30DegRandom = () =>  Math.floor(Math.random()*60-30);


class ImgFigure extends React.Component {

    constructor(props) {
        super(props);
       this.handleClick = this.handleClick.bind(this);
    }

    /**
     * imgFigure的点击处理函数
     * @param e
     */
    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }


    render() {
        let styleObj = {};
        //如果props属性中指定了这张图片的位置,则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        //添加图片旋转角度
        if(this.props.arrange.rotate){
            let prefixArr =  ['MozTransform','MsTransform','WebkitTransform','transform'];
            prefixArr.forEach( value => {
                styleObj[value] = 'rotate('+this.props.arrange.rotate +'deg)';
            });
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        //添加旋转的class
        let imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';


        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

/**
 * 底部控制栏组件
 */
class ControllerUnit extends React.Component {

    constructor(props) {
        super(props);

       this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        let controllerUintClassName = 'controller-unit';
        //对应的图片如果居中，则按钮居中
        if(this.props.arrange.isCenter){
            controllerUintClassName += ' is-center';
        }
        //如果对应的图片翻转，则按钮旋转
        if(this.props.arrange.isInverse){
            controllerUintClassName += ' is-inverse';
        }

        return (
            <span className={controllerUintClassName} onClick={this.handleClick}> </span>
        );
    }
}


class GalleryByReactApp extends React.Component {

    /* 构造函数*/
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: { //水平方向的取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { //垂直方向
                x: [0, 0],
                topY: [0, 0]
            }
        };

        /**
         *  imgsArrangeArr 存放每张图片的位置信息，旋转角度信息
         */
        this.state = {
            imgsArrangeArr: [
                /* {
                     pos:{ left:0, top:0}
                     rotate: 0          //旋转角度
                     isInverse： false  // 图片是否正反面
                     isCenter: false   //图片是否居中
                }  */
            ]
        };
    }

    /**
     *  重新布局所有图片
     *  @param: centerIndex指定居中排布哪个图片
     */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
            topImgSpiceIndex = 0,  //标记上侧图片的索引，先标记为0
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); //存放居中图片的状态信息

        //首先居中centerIndex图片 ,centerIndex图片不需要旋转
        imgsArrangeCenterArr[0].pos = centerPos;
        imgsArrangeCenterArr[0].rotate = 0;
        imgsArrangeCenterArr[0].isCenter = true;

        //取出要布局上测的图片的状态信息
        topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangTopArr.forEach((value, index) => {
            imgsArrangTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        //布局左两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            //前半部分布局左边,右边部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        }

        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
            imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    /**
     * 利用rearrange函数居中对应index的图片
     * @param index 需要被居中的图片的索引值
     * return {function}
     */
    center(index){
        return () => this.rearrange(index);
    }

    /**
     * 翻转图片
     * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
     */
    inverse(index){
        return () => {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }
    }


    /**
     * componentDidMount方法：组件渲染完成后(即已经出现在dom中)执行的操作
     * 操作：为每张图片计算其位置范围
     */
    componentDidMount() {
        //拿到舞台的大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,     //舞台宽度
            stageH = stageDOM.scrollHeight,    //舞台高度
            halfStageW = Math.ceil(stageW / 2),  //舞台一半宽度
            halfStageH = Math.ceil(stageH / 2);  //舞台一半高度

        //拿到一个imgFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //计算左侧,右侧区域图片排布的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上测区域图片排布的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0); //默认指定第一张居中
    }


    render() {
        let cotrollerUnits = [],
            imgFigure = [];

        imageDatas.forEach((value, index) => {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigure.push(
                <ImgFigure  key={index}
                            data={value} ref={'imgFigure' + index}
                            arrange={this.state.imgsArrangeArr[index]}
                            inverse={this.inverse(index)}
                            center={this.center(index)}
                />);
            cotrollerUnits.push(
                <ControllerUnit key={index}
                            arrange={this.state.imgsArrangeArr[index]}
                            inverse={this.inverse(index)}
                            center={this.center(index)}
                />);
        });

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigure}
                </section>
                <nav className="controller-nav">
                    {cotrollerUnits}
                </nav>
            </section>
        );
    }
}


GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;