import React, { useState, useEffect } from 'react';
import abcjs from 'abcjs';

const defaultNotation = `
M:4/4
L:1/4
K:C
| C C C C |
`;


const engraverParams = {
  // add_classes: false,
  // editable: true,
  // listener: null,
  // paddingbottom: 30,
  paddingleft: 0,
  paddingright: 0,
  paddingtop: 0,
  responsive: true,
  scale: 1,
  staffwidth: 740,
};

const parserParams = {
  // header_only: false,
  // hint_measures: false,
  // print: false,
  // stop_on_warning: false,
  // wrap: true
};

const renderParams = {
  oneSvgPerLine: false,
  // scrollHorizontal: false,
  // startingTune: 0,
  // viewportHorizontal: false,
};

export default function App(props) {

  const refTest = React.createRef()

  const renderNotation = () => {
    const NOTATION = abcjs.renderAbc(
      refTest.current,
      props.notation,
      engraverParams,
      parserParams,
      renderParams
    );
  }

  useEffect(() => {
    renderNotation()
  }, [props.notation])

  return (
    <div
      className="notation"
      style={{
        "width": "40%",
      }}
      ref={refTest}
    ></div>
  )
}
