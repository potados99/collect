import { randomUUID } from "crypto";
import HttpError from "../common/HttpError";

export type UserInfo = {
  name: string | null;
  userAgent: string | null;
  sourceIp: string;
};

type CommitMetadata = {
  author: UserInfo;
  committedAt: number;
};

type PostingCommit = {
  type: "post";
  body: string;
} & CommitMetadata;

type PatchingCommit = {
  type: "patch";
  body: string;
} & CommitMetadata;

type DeletingCommit = {
  type: "delete";
} & CommitMetadata;

export type Commit = PostingCommit | PatchingCommit | DeletingCommit;

export default class Message {
  constructor(public readonly id: string, public readonly channel: string, public readonly commits: Commit[]) {}

  static fromJson(obj: any): Message {
    return new Message(obj.id, obj.channel, obj.commits);
  }

  static fromNewRequest(channelName: string, body: string, author: UserInfo): Message {
    return new Message(randomUUID(), channelName, [
      {
        type: "post",
        body,
        author,
        committedAt: Date.now(),
      },
    ]);
  }

  get firstCommit() {
    if (this.commits.length === 0) {
      throw new Error("커밋이 없습니다.");
    }

    return this.commits[0];
  }

  get lastCommit() {
    if (this.commits.length === 0) {
      throw new Error("커밋이 없습니다.");
    }

    return this.commits[this.commits.length - 1];
  }

  get isDeleted() {
    return this.lastCommit.type === "delete";
  }

  update(body: string, author: UserInfo) {
    if (this.isDeleted) {
      throw new HttpError(409, "Message is deleted.");
    }

    this.commits.push({
      type: "patch",
      body,
      author,
      committedAt: Date.now(),
    });
  }

  delete(author: UserInfo) {
    if (this.isDeleted) {
      throw new HttpError(409, "Message already deleted.");
    }

    this.commits.push({
      type: "delete",
      author,
      committedAt: Date.now(),
    });
  }

  toResponse() {
    return {
      id: this.id,
      channel: this.channel,
      commits: this.commits,

      body: this.lastCommit.type === "delete" ? null : this.lastCommit.body, // 호환을 위한 필드입니다.
      timestamp: this.firstCommit.committedAt, // 호환을 위한 필드입니다.
      date: new Date(this.firstCommit.committedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }), // 호환을 위한 필드입니다.
    };
  }
}
