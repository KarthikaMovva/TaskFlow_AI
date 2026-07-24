export interface HistoryComparison {

    improved: boolean;

    summary: string;

    details: string[];

}

export function compareHistory(

    previous: {

        score: number;

        health: string;

    },

    current: {

        score: number;

        health: string;

    }

): HistoryComparison {

    const details: string[] = [];

    const difference =
        current.score - previous.score;

    if (difference > 0) {

        details.push(
            `Project score increased by ${difference}.`
        );

    }

    else if (difference < 0) {

        details.push(
            `Project score decreased by ${Math.abs(difference)}.`
        );

    }

    else {

        details.push(
            "Project score remained unchanged."
        );

    }

    if (previous.health !== current.health) {

        details.push(
            `Health changed from ${previous.health} to ${current.health}.`
        );

    }

    const improved = difference > 0;

    let summary: string;

    if (improved) {

        summary =
            `Project health improved by ${difference} points.`;

        details.push(
            "Project delivery appears to be improving."
        );

    }

    else if (difference < 0) {

        summary =
            `Project health declined by ${Math.abs(difference)} points.`;

        details.push(
            "Project delivery requires attention."
        );

    }

    else {

        summary =
            "Project health remained stable.";

    }

    return {

        improved,

        summary,

        details

    };

}