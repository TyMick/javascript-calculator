// Constants
const CHAR_LIMIT = 15;
const LARGE_NUM = 1000000000000000;
const DIGIT = "DIGIT";
const DECIMAL = "DECIMAL";
const OPERATOR = "OPERATOR";
const EQUALS = "EQUALS";
const OPERATORS = {
  divide: "/",
  multiply: "*",
  subtract: "-",
  add: "+" };


// App in a single component
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "0",
      expression: "0",
      lastButtonType: DIGIT,
      holdNegative: false };

    this.handleDigit = this.handleDigit.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleDigit(e) {
    // Prevent leading zeroes by replacing a lone 0 with any digit
    if (this.state.display == "0" || this.state.display == "\u22120") {
      this.setState({
        display:
        this.state.display.substring(0, this.state.display.length - 1) +
        e.target.innerHTML,
        expression:
        this.state.expression.substring(0, this.state.expression.length - 1) +
        e.target.innerHTML,
        lastButtonType: DIGIT });

    } else {
      switch (this.state.lastButtonType) {
        case DIGIT:
        case DECIMAL:
          // Add digits to display until limit
          if (this.state.display.length < CHAR_LIMIT) {
            this.setState({
              display: this.state.display + e.target.innerHTML,
              expression: this.state.expression + e.target.innerHTML,
              lastButtonType: DIGIT });

          }
          break;

        case OPERATOR:
          // Replace display
          this.setState({
            display: (this.state.holdNegative ? "-" : "") + e.target.innerHTML,
            expression:
            this.state.expression + (
            this.state.holdNegative ? "-" : "") +
            e.target.innerHTML,
            lastButtonType: DIGIT,
            holdNegative: false });

          break;

        case EQUALS:
          // Replace expression and display
          this.setState({
            display: e.target.innerHTML,
            expression: e.target.innerHTML,
            lastButtonType: DIGIT });}


    }
  }

  handleDecimal(e) {
    switch (this.state.lastButtonType) {
      case DIGIT:
        // Check for previous decimal points, then add to display
        if (
        !this.state.display.includes(".") &&
        this.state.display.length < CHAR_LIMIT)
        {
          this.setState({
            display: this.state.display + ".",
            expression: this.state.expression + ".",
            lastButtonType: DECIMAL });

        }
        break;

      case DECIMAL:
        // Nope
        break;

      case OPERATOR:
        // Replace display with "0."
        this.setState({
          display: (this.state.holdNegative ? "-" : "") + "0.",
          expression:
          this.state.expression + (this.state.holdNegative ? "-" : "") + "0.",
          lastButtonType: DECIMAL,
          holdNegative: false });


      case EQUALS:
        // Replace expression and display
        this.setState({
          display: "0.",
          expression: "0.",
          lastButtonType: DECIMAL });}


  }

  handleOperator(e) {
    switch (this.state.lastButtonType) {
      case DIGIT:
      case DECIMAL:
        // Add operator to expression
        this.setState({
          expression: this.state.expression + OPERATORS[e.target.id],
          lastButtonType: OPERATOR });

        break;

      case OPERATOR:
        // Handle weird freeCodeCamp minus test
        if (e.target.id == "subtract") {
          this.setState({
            holdNegative: true });

        } else {
          // Replace last operator
          this.setState({
            expression:
            this.state.expression.substring(
            0,
            this.state.expression.length - 1) +
            OPERATORS[e.target.id],
            lastButtonType: OPERATOR,
            holdNegative: false });

        }
        break;

      case EQUALS:
        // Start new expression with result
        this.setState({
          expression: this.state.expression + OPERATORS[e.target.id],
          lastButtonType: OPERATOR });}


  }

  handleEquals(e) {
    let exp = this.state.expression;
    switch (this.state.lastButtonType) {
      case OPERATOR:
        // Remove operator and continue to evaluation
        exp = exp.substring(0, exp.length - 1);

      case DIGIT:
      case DECIMAL:
        // Evaluate
        let result = eval(exp);

        // Switch to E-notation on large numbers
        if (result >= LARGE_NUM || result <= -LARGE_NUM / 10) {
          this.setState({
            display: result.toExponential(CHAR_LIMIT - 7),
            expression: result.toString(),
            lastButtonType: EQUALS,
            holdNegative: false });

        }

        // Round other numbers as necessary
        else if (result.toString().length > CHAR_LIMIT) {
            let rounded;
            if (result.toString().indexOf(".") >= CHAR_LIMIT - 1) {
              rounded = Math.round(result);
            } else {
              let decimalPlaces = CHAR_LIMIT - 1 - result.toString().indexOf(".");
              rounded =
              Math.round(Math.pow(10, decimalPlaces) * result) /
              Math.pow(10, decimalPlaces);
            }
            this.setState({
              display: rounded.toString(),
              expression: result.toString(),
              lastButtonType: EQUALS,
              holdNegative: false });

          }

          // Display the rest
          else {
              this.setState({
                display: result.toString(),
                expression: result.toString(),
                lastButtonType: EQUALS,
                holdNegative: false });

            }}

  }

  handleClear(e) {
    this.setState({
      display: "0",
      expression: "0",
      lastButtonType: DIGIT,
      holdNegative: false });

  }

  render() {
    return (
      React.createElement("div", { id: "wrapper", className: "card p-3 d-inline-block bg-light" },
      React.createElement("div", { id: "display", className: "card text-left py-2 px-3 mb-3" },
      React.createElement("samp", { className: "lead" }, this.state.display)),

      React.createElement("div", { className: "mb-1" },
      React.createElement("button", {
        id: "clear",
        type: "button",
        className: "btn btn-danger btn-lg mr-1",
        onClick: this.handleClear }, "AC"),



      React.createElement("button", {
        id: "divide",
        type: "button",
        className: "btn btn-warning btn-lg",
        onClick: this.handleOperator }, "\xF7")),




      React.createElement("div", { className: "mb-1" },
      React.createElement("button", {
        id: "seven",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "7"),



      React.createElement("button", {
        id: "eight",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "8"),



      React.createElement("button", {
        id: "nine",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "9"),



      React.createElement("button", {
        id: "multiply",
        type: "button",
        className: "btn btn-warning btn-lg",
        onClick: this.handleOperator }, "\xD7")),




      React.createElement("div", { className: "mb-1" },
      React.createElement("button", {
        id: "four",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "4"),



      React.createElement("button", {
        id: "five",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "5"),



      React.createElement("button", {
        id: "six",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "6"),



      React.createElement("button", {
        id: "subtract",
        type: "button",
        className: "btn btn-warning btn-lg",
        onClick: this.handleOperator }, "\u2212")),




      React.createElement("div", { className: "mb-1" },
      React.createElement("button", {
        id: "one",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "1"),



      React.createElement("button", {
        id: "two",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "2"),



      React.createElement("button", {
        id: "three",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "3"),



      React.createElement("button", {
        id: "add",
        type: "button",
        className: "btn btn-warning btn-lg",
        onClick: this.handleOperator }, "+")),




      React.createElement("div", null,
      React.createElement("button", {
        id: "zero",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDigit }, "0"),



      React.createElement("button", {
        id: "decimal",
        type: "button",
        className: "btn btn-secondary btn-lg mr-1",
        onClick: this.handleDecimal }, "."),



      React.createElement("button", {
        id: "equals",
        type: "button",
        className: "btn btn-primary btn-lg",
        onClick: this.handleEquals }, "="))));






  }}


// Render to #app
ReactDOM.render(React.createElement(Calculator, null), document.getElementById("app"));