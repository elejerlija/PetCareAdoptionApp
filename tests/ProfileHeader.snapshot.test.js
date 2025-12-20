import React from "react";
import renderer from "react-test-renderer";
import ProfileHeader from "../components/ProfileHeader";

describe("ProfileHeader Snapshot Test", () => {
  it("matches snapshot", () => {
    const tree = renderer
      .create(<ProfileHeader photoURL="" name="John Doe" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
