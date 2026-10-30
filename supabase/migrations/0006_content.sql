alter table tools add column if not exists long_description text;
alter table tools add column if not exists who_for text;
alter table tools add column if not exists pricing_details text;
alter table tools add column if not exists last_verified date;

-- Original write-ups for six tools (examples). Pricing is described in general terms only.
-- last_verified is left empty on purpose: set it only after you have checked the official site, e.g.
--   update tools set last_verified = current_date where slug = 'chatgpt';
update tools set
 long_description = 'ChatGPT is a general-purpose AI assistant from OpenAI. You write a request in plain language and it answers, drafts, summarises, explains or brainstorms. Depending on your plan it can also analyse uploaded files, search the web, work with images and run code for data tasks. It is a good first tool to try because one interface covers writing, learning, planning and light coding. Like every language model it can state wrong facts confidently, so check important details against a reliable source.',
 who_for = 'People who want one flexible assistant for everyday writing, study, research starting points and brainstorming, from students to professionals. Teams with strict privacy rules should review OpenAI data settings before sharing sensitive material.',
 use_cases = array['Drafting emails and reports','Explaining unfamiliar topics step by step','Brainstorming ideas and outlines','Summarising long documents'],
 pricing_details = 'There is a free plan with usage limits. Paid individual and team plans raise those limits and unlock more advanced models and features. Check the official pricing page for current plans and prices.'
where slug = 'chatgpt';
update tools set
 long_description = 'Claude is an AI assistant from Anthropic, known for careful writing and its ability to work with long documents. You can chat with it, upload files to analyse, and use it for drafting, editing and coding help. People often choose it for tasks that involve reading a lot of text and producing a clear, well-organised answer. As with other assistants, it can make mistakes, so check key facts.',
 who_for = 'Writers, analysts and developers who work with long documents or want polished, readable drafts. Also useful for students summarising readings.',
 use_cases = array['Summarising reports and contracts','Editing and rewriting drafts','Explaining and reviewing code','Turning notes into structured documents'],
 pricing_details = 'A free plan with usage limits is available. Paid plans increase usage limits and add features for individuals and teams. See the official pricing page for current details.'
where slug = 'claude';
update tools set
 long_description = 'Perplexity is an AI answer engine. Instead of a list of links, it writes a short answer and shows the sources it used, so you can click through and check them. It works well for quick research, comparing options and getting up to speed on a topic. Because answers depend on the pages it finds, open the cited sources for anything important.',
 who_for = 'Students, researchers and curious readers who want fast, sourced answers rather than a page of search results.',
 use_cases = array['Researching a topic with citations','Comparing products or services','Catching up on recent news','Finding starting points for a report'],
 pricing_details = 'Free searches are available with limits on advanced features. A paid plan adds more advanced searches and model options. Check the official pricing page for the current plan.'
where slug = 'perplexity';
update tools set
 long_description = 'Midjourney generates images from text descriptions and is popular for its distinctive, artistic look. You describe a scene, pick from the results, and refine or upscale the ones you like. It suits concept art, mood boards, posters and social visuals. Results vary with how you word your prompt, so expect some experimentation before you get the image you picture.',
 who_for = 'Designers, marketers and hobbyists who want striking, stylised images and do not mind learning prompt wording. Less suited to exact, brand-controlled layouts.',
 use_cases = array['Concept art and mood boards','Social media visuals','Book and album cover ideas','Visual brainstorming for client pitches'],
 pricing_details = 'Midjourney is paid only, with monthly plans that differ mainly in how much generation time you get. Check the official site for current plans and whether a trial is offered.'
where slug = 'midjourney';
update tools set
 long_description = 'Canva is a drag-and-drop design platform for presentations, social posts, documents, videos and more. Its AI features help with tasks like writing text, removing backgrounds and generating images. A large library of templates makes it fast to produce clean designs without design skills.',
 who_for = 'Small businesses, teachers, students and social media managers who need good-looking designs quickly without professional design software.',
 use_cases = array['Presentations and pitch decks','Instagram and LinkedIn posts','Posters, flyers and invitations','Quick edits like background removal'],
 pricing_details = 'Canva has a free plan with many templates and tools. Paid plans add premium templates, brand tools and more AI features. See the official pricing page for current tiers.'
where slug = 'canva';
update tools set
 long_description = 'GitHub Copilot is an AI assistant for programmers. It suggests code as you type, answers questions in a chat panel and can help explain unfamiliar code or write tests. It works inside popular editors, so you keep your normal workflow. Suggestions can be wrong or insecure, so review and test anything it writes.',
 who_for = 'Developers of all levels who want faster boilerplate, help with unfamiliar languages and a second pair of eyes on code.',
 use_cases = array['Autocompleting repetitive code','Explaining legacy code','Generating unit tests','Learning a new framework'],
 pricing_details = 'GitHub offers a free tier with limited usage, plus paid individual and business plans with higher limits and more features. Students and some open-source maintainers may qualify for free access. Check the official plans page for current details.'
where slug = 'github-copilot';
