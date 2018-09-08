import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class ScratchpadDropDown extends Component {
  scratchpadOptions = scratchpads =>
    scratchpads.map(scratchpad => {
      return {
        text: this.parseContent(scratchpad.content),
        key: scratchpad.id,
        value: scratchpad.id,
      };
    });

  parseContent = content => {
    const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanContent.length > 0 ? cleanContent.slice(0, 40) + "..." : "";
  };

  render() {
    const { scratchpads, onChange, value } = this.props;

    return (
      <Dropdown
        placeholder="Select Scratchpad"
        selection
        value={value}
        item
        onChange={onChange}
        options={this.scratchpadOptions(scratchpads)}
      />
    );
  }
}

export default ScratchpadDropDown;
