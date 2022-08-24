type analyzer = {
  description: string;
  callIncOccurance: (line: string) => void;
};

class CommentAnalyzer {
  private resultsMap: Map<string, bigint>;
  private analyzers: analyzer[] = [
    {
      description: "check comments with less than 15 characters",
      callIncOccurance: (line: string) => {
        if (line.length < 15) {
          this.incOccurrence(this.resultsMap, "SHORTER_THAN_15");
        }
      },
    },
    {
      description: "check comments for the keyword 'Mover'",
      callIncOccurance: (line: string) => {
        if (line.match(/Mover/gi)) {
          this.incOccurrence(this.resultsMap, "MOVER_MENTIONS");
        }
      },
    },
    {
      description: "check comments for the keyword 'Shaker'",
      callIncOccurance: (line: string) => {
        if (line.match(/Shaker/gi)) {
          this.incOccurrence(this.resultsMap, "SHAKER_MENTIONS");
        }
      },
    },
    {
      description: "check comments for question marks'",
      callIncOccurance: (line: string) => {
        if (line.match(/\?/g)) {
          this.incOccurrence(this.resultsMap, "QUESTION_MARKS");
        }
      },
    },
    {
      description: "check comments for URLS'",
      callIncOccurance: (line: string) => {
        // eslint-disable-next-line max-len
        if (
          line.match(
            /(http(s)?:)(\/\/)?((\.)?(\w)+){1,}(\.(\w{2,}))((:(\d+)?){1})?((\/|\?).+)?/gi
          )
        ) {
          this.incOccurrence(this.resultsMap, "URL_SPAM");
        }
      },
    },
  ];

  public constructor(map: Map<string, bigint>) {
    this.resultsMap = map;
  }

  private incOccurrence(countMap: Map<string, bigint>, key: string): void {
    if (countMap.get(key)) {
      countMap.set(key, countMap.get(key)! + 1n);
    } else {
      countMap.set(key, 1n);
    }
  }

  public analyze(data: string): Map<string, bigint> {
    data.split(process.env.LINE_SPLITTER!).forEach((line) => {
      this.analyzers.forEach((analyzerObjectType) => {
        analyzerObjectType.callIncOccurance(line);
      });
    });
    return this.resultsMap;
  }
}

export { CommentAnalyzer };
