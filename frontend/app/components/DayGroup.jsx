import React from "react";
import GroupedList from "./groupedList/GroupedList";
import LogCard from "./LogCard";

const DayGroup = ({ groups, onEditLog }) => (
  <GroupedList
    groups={groups}
    renderItem={(log) => <LogCard log={log} onEdit={onEditLog} />}
  />
);

export default DayGroup;
