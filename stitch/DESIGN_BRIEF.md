# STITCH_BATCH_BRIEF

Generate exactly 5 production-quality UI screens for the Product Surface targets below.
Batch stage: all surfaces.
Generate every SCREEN_SPEC in this batch call. Do not generate screens outside this stage.
If this Stitch project already has screens from an earlier stage, preserve the same visual system, navigation pattern, density, typography, spacing, and component language.
Target device type: DESKTOP.
All visible user-facing text must be in English.

## PRODUCT_VISION_SUMMARY
- SignalDesk Mini turns the user's request into a directly usable web workflow. The first experience must be the actual web product behavior, not a marketing landing page or placeholder demo.
- - FR-001: Build a compact single-page tool called SignalDesk Mini. It should show a status summary, an incident list, a filter bar, and a details drawer. Use plain HTML, CSS, and JavaScript only, persist state in localStorage, and include clear empty, error, and recovery states.
- Users who need the requested web product to work immediately with clear feedback, recovery paths, and deterministic verification hooks.

## REQUIRED_SCREEN_TITLES
- Record Operations - SignalDesk Mini
- Record Editor - SignalDesk Mini
- Insights - SignalDesk Mini
- Settings and Preferences - SignalDesk Mini
- Empty and Error Recovery - SignalDesk Mini

## SCREEN_SPECS
SCREEN_SPEC_1:
- exact_screen_title: Record Operations - SignalDesk Mini
- surface_id: SURF_RECORD_OPERATIONS
- unique_canvas_caption: Record Operations: summary metrics, primary list/board/table, filters, search, selected item preview, empty/loading/error states.
- purpose: Give the user the main operational view for inspecting, searching, filtering, and acting on Record data.
- required_content: summary metrics, primary list/board/table, filters, search, selected item preview, empty/loading/error states.
- data_entities: Record, ActivityEvent, Preference
- visible_actions: ACT_SEARCH_RECORDS as search_input_persistent, ACT_CREATE_RECORD as primary_button, ACT_SELECT_RECORD as inline_edit, ACT_RETRY_LOAD as secondary_button
- entry_exit_rules: direct_url -> If data is unavailable, stay on the same surface and show retry/clear actions.
- design_guidance: Dense but calm product UI; avoid marketing hero composition and unrelated admin/reporting modules.

SCREEN_SPEC_2:
- exact_screen_title: Record Editor - SignalDesk Mini
- surface_id: SURF_RECORD_EDITOR
- unique_canvas_caption: Record Editor: form fields, required/optional indicators, validation messages, save/cancel controls, unsaved-state feedback.
- purpose: Let the user create, edit, validate, save, cancel, and recover Record changes.
- required_content: form fields, required/optional indicators, validation messages, save/cancel controls, unsaved-state feedback.
- data_entities: Record, ValidationError
- visible_actions: ACT_SAVE_RECORD as form_submit, ACT_CANCEL_EDIT as secondary_button
- entry_exit_rules: SURF_RECORD_OPERATIONS -> Save returns to SURF_RECORD_OPERATIONS with persisted changes; cancel preserves existing data and closes the editor.
- design_guidance: Form layout must be clear and task-specific; do not invent payment, onboarding, or unrelated identity forms.

SCREEN_SPEC_3:
- exact_screen_title: Insights - SignalDesk Mini
- surface_id: SURF_INSIGHTS
- unique_canvas_caption: Insights: small metrics, recent activity, state distribution, actionable follow-up hints, empty/error state.
- purpose: Show useful summaries, trends, and status signals derived from Record data without becoming a separate analytics product.
- required_content: small metrics, recent activity, state distribution, actionable follow-up hints, empty/error state.
- data_entities: Record, ActivityEvent
- visible_actions: ACT_FILTER_INSIGHTS as context_menu, ACT_EXPORT_SUMMARY as secondary_button
- entry_exit_rules: SURF_RECORD_OPERATIONS -> No external BI/admin area; returns to SURF_RECORD_OPERATIONS.
- design_guidance: Keep insight content project-relevant and compact; no generic charts unrelated to the requested domain.

SCREEN_SPEC_4:
- exact_screen_title: Settings and Preferences - SignalDesk Mini
- surface_id: SURF_SETTINGS_AND_PREFERENCES
- unique_canvas_caption: Settings and Preferences: saved filters, default views, notification or density preferences when relevant, reset controls, and visible save feedback.
- purpose: Let users adjust Record workflow preferences, saved filters, defaults, or product settings requested by the task.
- required_content: saved filters, default views, notification or density preferences when relevant, reset controls, and visible save feedback.
- data_entities: Preference
- visible_actions: ACT_SAVE_PREFERENCES as form_submit, ACT_RETRY_LOAD as secondary_button
- entry_exit_rules: SURF_RECORD_OPERATIONS -> Saved preferences immediately affect visible product state or show a clear confirmation.
- design_guidance: Settings must support the requested workflow only; do not invent unrelated profile or billing areas.

SCREEN_SPEC_5:
- exact_screen_title: Empty and Error Recovery - SignalDesk Mini
- surface_id: SURF_EMPTY_AND_ERROR_RECOVERY
- unique_canvas_caption: Empty and Error Recovery: clear cause, retry/reset controls, create-first action, clear-filter action, and state-specific guidance.
- purpose: Keep the Record workflow usable when data is missing, filtered away, loading, failed, or corrupt.
- required_content: clear cause, retry/reset controls, create-first action, clear-filter action, and state-specific guidance.
- data_entities: Record, ActivityEvent, Preference
- visible_actions: ACT_RETRY_LOAD as primary_button, ACT_CREATE_RECORD as secondary_button
- entry_exit_rules: SURF_RECORD_OPERATIONS, SURF_INSIGHTS -> Recovery returns to the active Record workflow and preserves unrelated state.
- design_guidance: Recovery states must be useful product states, not blank placeholder panels.

## OUTPUT_RULES
- Create one distinct canvas/frame per SCREEN_SPEC.
- Do not create a design-system/style-guide canvas as an output screen. Apply the design system inside the product screens only.
- Do not output palette, typography, component inventory, or moodboard screens.
- Use exact_screen_title as the screen title/name. Do not rename screens to generic labels.
- Use unique_canvas_caption for that screen only. Do not reuse one global caption across screens.
- Do not place the whole chunk summary, PRD summary, Key Deliverables text, or any follow-up question as visible screen captions.
- Do not write 'How would you like to proceed?', 'We could refine...', or similar assistant chat text in the design output.
- Each screen must visibly emphasize its own required_content and visible_actions. Do not let all screens share the same layout content.

## STRICT_UI_SCOPE_CONTRACT
- Every generated screen must map to one or more SCREEN_SPECS above.
- Do not invent modules, dashboards, marketing pages, admin areas, ecommerce flows, docs, account, or profile areas outside the Product Surfaces.
- Every permitted action from the matching Product Surface should have a plausible visible control or platform-appropriate interaction.
- Empty, loading, validation, and error states may be included only inside the declared Product Surfaces.

## PRODUCT_SURFACES
1. SURF_RECORD_OPERATIONS - Record Operations
   Purpose: Give the user the main operational view for inspecting, searching, filtering, and acting on Record data.
   Data: Record, ActivityEvent, Preference
   Core content: summary metrics, primary list/board/table, filters, search, selected item preview, empty/loading/error states.
   Actions: ACT_SEARCH_RECORDS (search_input_persistent), ACT_CREATE_RECORD (primary_button), ACT_SELECT_RECORD (inline_edit), ACT_RETRY_LOAD (secondary_button)
   Entry/exit: direct_url -> If data is unavailable, stay on the same surface and show retry/clear actions.
   Guidance: Dense but calm product UI; avoid marketing hero composition and unrelated admin/reporting modules.

2. SURF_RECORD_EDITOR - Record Editor
   Purpose: Let the user create, edit, validate, save, cancel, and recover Record changes.
   Data: Record, ValidationError
   Core content: form fields, required/optional indicators, validation messages, save/cancel controls, unsaved-state feedback.
   Actions: ACT_SAVE_RECORD (form_submit), ACT_CANCEL_EDIT (secondary_button)
   Entry/exit: SURF_RECORD_OPERATIONS -> Save returns to SURF_RECORD_OPERATIONS with persisted changes; cancel preserves existing data and closes the editor.
   Guidance: Form layout must be clear and task-specific; do not invent payment, onboarding, or unrelated identity forms.

3. SURF_INSIGHTS - Insights
   Purpose: Show useful summaries, trends, and status signals derived from Record data without becoming a separate analytics product.
   Data: Record, ActivityEvent
   Core content: small metrics, recent activity, state distribution, actionable follow-up hints, empty/error state.
   Actions: ACT_FILTER_INSIGHTS (context_menu), ACT_EXPORT_SUMMARY (secondary_button)
   Entry/exit: SURF_RECORD_OPERATIONS -> No external BI/admin area; returns to SURF_RECORD_OPERATIONS.
   Guidance: Keep insight content project-relevant and compact; no generic charts unrelated to the requested domain.

4. SURF_SETTINGS_AND_PREFERENCES - Settings and Preferences
   Purpose: Let users adjust Record workflow preferences, saved filters, defaults, or product settings requested by the task.
   Data: Preference
   Core content: saved filters, default views, notification or density preferences when relevant, reset controls, and visible save feedback.
   Actions: ACT_SAVE_PREFERENCES (form_submit), ACT_RETRY_LOAD (secondary_button)
   Entry/exit: SURF_RECORD_OPERATIONS -> Saved preferences immediately affect visible product state or show a clear confirmation.
   Guidance: Settings must support the requested workflow only; do not invent unrelated profile or billing areas.

5. SURF_EMPTY_AND_ERROR_RECOVERY - Empty and Error Recovery
   Purpose: Keep the Record workflow usable when data is missing, filtered away, loading, failed, or corrupt.
   Data: Record, ActivityEvent, Preference
   Core content: clear cause, retry/reset controls, create-first action, clear-filter action, and state-specific guidance.
   Actions: ACT_RETRY_LOAD (primary_button), ACT_CREATE_RECORD (secondary_button)
   Entry/exit: SURF_RECORD_OPERATIONS, SURF_INSIGHTS -> Recovery returns to the active Record workflow and preserves unrelated state.
   Guidance: Recovery states must be useful product states, not blank placeholder panels.

## UI_SAFE_PRD_CONTEXT
Use this only to understand product behavior and missing UI states. Do not render this text directly. SCREEN_SPECS remain the active screen source.
## 1. Context And Goals - Overview: SignalDesk Mini turns the user's request into a directly usable web workflow. The first experience must be the actual web product behavior, not a marketing landing page or placeholder demo. - Target Audience: Users who need the requested web product to work immediately with clear feedback, recovery paths, and deterministic verification hooks. - UI Language: English. Pipeline metadata, action IDs, surface IDs, story titles, technical reports, and file identifiers remain English. - Core Objectives: - FR-001: Build a compact single-page tool called SignalDesk Mini. It should show a status summary, an incident list, a filter bar, and a details drawer. Use plain HTML, CSS, and JavaScript only, persist state in localStorage, and include clear empty, error, and recovery states. - Business Goals: reduce ambiguity for downstream agents, preserve the requested domain, and keep unrelated modules out of scope. - User Goals: inspect current state, take primary actions, understand validation/recovery feedback, and return to a stable state after failures. - Primary Workflows: load product state, perform the main action, recover from validation/system errors, and verify final state through the platform-appropriate test surface. - Non-Functional: first usable state under 2s for local/frontend apps, WCAG 2.1 AA for UI platforms, deterministic test handles, and responsive behavior for UI platforms. - External Dependencies: none unless explicitly listed in the task or System Contracts. ## 3. Behavioral And Action Contract ## 5. Validation And Error Strategy - Validation Rules: required text fields cannot be empty; status/enum values must be known; dates/timestamps must be parseable; destructive actions require explicit user intent. - Business Logic Errors: show contextual messages near the action and keep the previous valid state. - System/Network Errors: show a retryable banner or inline state with lastError details suitable for QA, not a silent reset. - Error Display Policy: forms use inline errors; global load/persist failures use compact banners or state panels; no blocking alert dialogs unless the platform requires them. ## 9. Out Of Scope - No physical screen table, screen-count field, or agent-invented screen list in PLAN. - DESIGN receives only scoped UI-facing context derived from Product Surfaces, display fields, permitted actions, validation behavior, and UI anti-goals. - No modules outside Product Surfaces, Action Contracts, or explicit task requirements. - No local fallback design; DESIGN must use Stitch when DESIGN_REQUIRED=true and must block on Stitch failure.