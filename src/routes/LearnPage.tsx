import { Link } from "react-router";
import { course, lesson, titleText } from "../content/course";
import {
  loadProgress,
  resetProgress,
} from "../features/lesson/progress";
import { steps } from "../features/lesson/steps";
import { PageHeader } from "../components/ui";

export function LearnPage() {
  const progress = loadProgress(lesson.id);
  const started = progress.currentStep > 0 || progress.completedSteps.length > 0;

  return (
    <section className="space-y-8">
      <PageHeader title="Learn" lede={titleText(course.title)} />
      <div className="panel space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold" lang="en">
            {titleText(lesson.title)}
          </h2>
          <p className="text-sm text-muted">
            {progress.lessonCompleted
              ? "Lesson complete — review any step below."
              : started
                ? `In progress — step ${progress.currentStep + 1} of ${steps.length}`
                : `${steps.length} steps · about one sitting`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/learn/lesson-1" className="btn btn-primary">
            {progress.lessonCompleted
              ? "Review lesson"
              : started
                ? `Continue — step ${progress.currentStep + 1}`
                : "Start"}
          </Link>
          {started && !progress.lessonCompleted ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                resetProgress();
                location.reload();
              }}
            >
              Start over
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
