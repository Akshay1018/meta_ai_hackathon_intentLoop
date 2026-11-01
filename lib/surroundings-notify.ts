/** Whether an automatic check should pop a Surroundings card (skip boring “all clear”). */

export function shouldAutoSurfaceNudge(input: {
  alertLevel?: string;
  nudge: string;
}): boolean {
  if (input.alertLevel === "urgent" || input.alertLevel === "caution") return true;
  const lower = input.nudge.toLowerCase();
  if (
    /all clear|no issues spotted|could not confirm the scene from sam alone|tap check surroundings again/.test(
      lower,
    )
  ) {
    return false;
  }
  return /phone|recording|behind|filming|traffic|crowd|pause|secure|private|watched|aware|device|camera|filming|glance/.test(
    lower,
  );
}
