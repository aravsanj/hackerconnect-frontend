/* eslint-disable import/no-anonymous-default-export */
export default {
    control: {
      backgroundColor: '#fff',
      fontSize: 16,
      fontWeight: 'normal',
    },
  
    '&multiLine': {
      control: {
        // fontFamily: 'monospace',
        minHeight: 60,
      },
      highlighter: {
        padding: 9,
        // border: '1px solid transparent',
      },
      input: {
        padding: 9,
        // border: '1px solid silver',
      },
     
    },
  
    '&singleLine': {
      display: 'inline-block',
      width: 180,
  
      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 1,
        border: '2px inset',
      },
    },
  
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 16,
        width: "200px",
        borderRadius: "8px",
        boxShadow: "horizontal-offset vertical-offset blur-radius spread-radius color",
        position: "relative",
        bottom: "140px"
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#8cd3ff',
        },
      },
    },
  }