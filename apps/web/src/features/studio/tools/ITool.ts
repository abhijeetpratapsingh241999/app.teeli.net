/**
 * ITool - Interface
 * Strategy Pattern: All tools implement this interface
 */

export interface ITool {
  update(): void;
  cancel(): void;
}
