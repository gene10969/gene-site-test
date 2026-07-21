
(function(){
  const questions = [
    { id:"sleep_onset", category:"sleep", text:"寝つきが悪い、または眠りが浅いと感じることがありますか？" },
    { id:"sleep_wakeup", category:"sleep", text:"夜中に目が覚める、朝起きても疲れが残ることがありますか？" },
    { id:"fatigue", category:"fatigue", text:"慢性的に疲れやすく、休んでも回復しにくいと感じますか？" },
    { id:"morning", category:"fatigue", text:"朝起きるのがつらい、午前中に身体が重いことがありますか？" },
    { id:"stress", category:"stress", text:"気持ちが休まらず、緊張や不安を感じやすいですか？" },
    { id:"irritability", category:"stress", text:"以前よりイライラしやすい、または気分の波を感じますか？" },
    { id:"dizziness", category:"nerve", text:"めまい、ふらつき、頭がぼーっとする感覚がありますか？" },
    { id:"headache", category:"nerve", text:"頭痛、頭の重さ、首肩の強いこりを感じることがありますか？" },
    { id:"stomach", category:"digestive", text:"胃の不快感、吐き気、食欲の乱れを感じることがありますか？" },
    { id:"bowel", category:"digestive", text:"便秘や下痢、お腹の張りなど、腸の不調を感じることがありますか？" },
    { id:"breath", category:"breath", text:"呼吸が浅い、深呼吸がしづらい、息苦しさを感じることがありますか？" },
    { id:"palpitation", category:"circulation", text:"動悸、胸のざわつき、手足の冷えを感じることがありますか？" },
    { id:"sensitivity", category:"sensitivity", text:"音・光・においなどに敏感になったと感じることがありますか？" },
    { id:"weather", category:"sensitivity", text:"天候や気圧、季節の変わり目で体調が変わりやすいですか？" },
    { id:"skin", category:"skin", text:"皮膚のかゆみ、汗の異常、肌荒れなどが体調と連動していると感じますか？" }
  ];

  const categoryMeta = {
    sleep:{ label:"睡眠", links:[ ["insomnia.html","不眠"], ["fatigue.html","慢性疲労"] ] },
    fatigue:{ label:"疲労", links:[ ["fatigue.html","慢性疲労"], ["orthostatic-dysregulation.html","起立性調節障害"] ] },
    stress:{ label:"ストレス", links:[ ["panic.html","パニック症状"], ["anxiety-disorder.html","不安障害"] ] },
    nerve:{ label:"頭・神経", links:[ ["dizziness.html","めまい"], ["headache.html","頭痛"], ["tinnitus.html","耳鳴り"] ] },
    digestive:{ label:"胃腸", links:[ ["stomach-discomfort.html","胃の不快感"], ["nausea.html","吐き気"], ["ibs.html","過敏性腸症候群"], ["chronic-constipation.html","慢性便秘"] ] },
    breath:{ label:"呼吸", links:[ ["shortness-of-breath.html","息苦しさ"], ["throat-discomfort.html","喉の違和感"] ] },
    circulation:{ label:"循環", links:[ ["palpitations.html","動悸"], ["coldness.html","冷え性"] ] },
    sensitivity:{ label:"感覚", links:[ ["autonomic.html","自律神経失調症"], ["dizziness.html","めまい"] ] },
    skin:{ label:"皮膚", links:[ ["atopic.html","アトピー・皮膚症状"] ] }
  };

  const optionLabels = ["ほとんどない", "たまにある", "よくある", "かなり当てはまる"];
  const state = { current:0, answers:{} };
  const tracking = {
    started:false,
    completed:false,
    lineClicked:false,
    exitSent:false,
    resultId:"",
    sessionId:"GQS-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase(),
    entryPage:""
  };

  function getParam(name){
    try{ return new URLSearchParams(location.search).get(name) || ""; }catch(e){ return ""; }
  }

  function currentPage(){
    return location.pathname.split("/").pop() || "index.html";
  }

  function sourcePage(){
    const from = getParam("from");
    if(from) return from.replace(/[^a-zA-Z0-9_.-]/g, "");
    try{
      if(document.referrer){
        const ref = new URL(document.referrer);
        if(ref.hostname === location.hostname){
          return ref.pathname.split("/").pop() || "index.html";
        }
      }
    }catch(e){}
    return currentPage();
  }

  function appendLocalLog(name, params){
    try{
      const key = "geneQuickCheckFunnelLog";
      const logs = JSON.parse(localStorage.getItem(key) || "[]");
      logs.push(Object.assign({
        event:name,
        time:new Date().toISOString(),
        page:currentPage(),
        source_page:tracking.entryPage || sourcePage(),
        check_session_id:tracking.sessionId,
        check_id:tracking.resultId || ""
      }, params || {}));
      localStorage.setItem(key, JSON.stringify(logs.slice(-300)));
    }catch(e){}
  }

  function baseParams(params){
    return Object.assign({
      event_category:"gene_quick_check",
      check_session_id:tracking.sessionId,
      source_page:tracking.entryPage || sourcePage(),
      current_page:currentPage(),
      check_id:tracking.resultId || ""
    }, params || {});
  }

  function trackEvent(name, params){
    const payload = baseParams(params);
    appendLocalLog(name, payload);
    if(typeof gtag === "function"){
      gtag("event", name, payload);
    }
  }

  function sendExitEvent(name, params){
    params = params || {};
    params.transport_type = "beacon";
    trackEvent(name, params);
  }

  window.geneQuickCheckTracking = window.geneQuickCheckTracking || {
    markBooking:function(checkId){
      tracking.resultId = checkId || tracking.resultId || "manual";
      trackEvent("quick_check_booking_confirmed", { funnel_stage:"booking_confirmed", event_label:tracking.resultId });
    },
    markVisit:function(checkId){
      tracking.resultId = checkId || tracking.resultId || "manual";
      trackEvent("quick_check_visit_completed", { funnel_stage:"visit_completed", event_label:tracking.resultId });
    },
    markDetail82Complete:function(checkId, totalScore){
      tracking.resultId = checkId || tracking.resultId || "manual";
      trackEvent("detail_82_complete", { funnel_stage:"detail_82_complete", event_label:tracking.resultId, detail_total_score:Number(totalScore || 0) });
    },
    markRecheckComplete:function(checkId, totalScore){
      tracking.resultId = checkId || tracking.resultId || "manual";
      trackEvent("recheck_complete", { funnel_stage:"recheck_complete", event_label:tracking.resultId, recheck_total_score:Number(totalScore || 0) });
    },
    exportLocalLog:function(){
      try{return JSON.parse(localStorage.getItem("geneQuickCheckFunnelLog") || "[]");}catch(e){return [];}
    }
  };

  function $(selector){ return document.querySelector(selector); }
  function $all(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector)); }
  function pad(n){ return String(n).padStart(2,"0"); }
  function makeId(){
    const now = new Date();
    const stamp = String(now.getFullYear()).slice(2) + pad(now.getMonth()+1) + pad(now.getDate());
    const rand = Math.random().toString(36).slice(2,6).toUpperCase();
    return "gene-" + stamp + "-" + rand.toLowerCase();
  }
  function stars(score, max){
    const level = Math.max(1, Math.min(5, Math.ceil((score / Math.max(max,1)) * 5)));
    return "★★★★★".slice(0,level) + "☆☆☆☆☆".slice(0,5-level);
  }
  function render(){
    const root = $("[data-gene-check]");
    if(!root) return;
    tracking.entryPage = sourcePage();
    trackEvent("quick_check_view", { funnel_stage:"view" });
    const questionsWrap = root.querySelector("[data-gene-check-questions]");
    questionsWrap.innerHTML = questions.map(function(q, index){
      return '<section class="gene-check-question" data-question-index="'+index+'">' +
        '<p class="gene-check-question__count">質問 '+(index+1)+' / '+questions.length+'</p>' +
        '<h2>'+q.text+'</h2>' +
        '<div class="gene-check-options">' +
          optionLabels.map(function(label, value){
            return '<button type="button" data-answer="'+value+'">'+label+'</button>';
          }).join("") +
        '</div>' +
      '</section>';
    }).join("");
    update();
    questionsWrap.addEventListener("click", function(e){
      const btn = e.target.closest("[data-answer]");
      if(!btn) return;
      if(!tracking.started){
        tracking.started = true;
        trackEvent("quick_check_start", { funnel_stage:"start" });
      }
      const value = Number(btn.getAttribute("data-answer"));
      state.answers[questions[state.current].id] = value;
      trackEvent("quick_check_answer", {
        funnel_stage:"answer",
        question_index:state.current + 1,
        question_id:questions[state.current].id,
        question_category:questions[state.current].category,
        answer_value:value,
        answered_count:Object.keys(state.answers).length
      });
      $all("[data-question-index='"+state.current+"'] [data-answer]").forEach(function(b){ b.classList.remove("is-selected"); });
      btn.classList.add("is-selected");
      if(state.current < questions.length - 1){
        state.current += 1;
        update();
      } else {
        showResult();
      }
    });
    const prev = root.querySelector("[data-gene-check-prev]");
    if(prev){
      prev.addEventListener("click", function(){
        if(state.current > 0){ state.current -= 1; update(); }
      });
    }
    const reset = root.querySelector("[data-gene-check-reset]");
    if(reset){
      reset.addEventListener("click", function(){
        trackEvent("quick_check_retry", { event_label: tracking.resultId || "unknown", check_id: tracking.resultId || "" });
        state.current = 0;
        state.answers = {};
        tracking.started = false;
        tracking.completed = false;
        tracking.lineClicked = false;
        tracking.exitSent = false;
        tracking.resultId = "";
        root.querySelector("[data-gene-check-result]").classList.remove("is-active");
        root.querySelector("[data-gene-check-main]").style.display = "block";
        update();
      });
    }
  }
  function update(){
    const root = $("[data-gene-check]");
    if(!root) return;
    $all(".gene-check-question").forEach(function(el){ el.classList.remove("is-active"); });
    const active = root.querySelector("[data-question-index='"+state.current+"']");
    if(active) active.classList.add("is-active");
    const q = questions[state.current];
    if(q && typeof state.answers[q.id] !== "undefined"){
      const selected = active.querySelector("[data-answer='"+state.answers[q.id]+"']");
      if(selected) selected.classList.add("is-selected");
    }
    const progress = root.querySelector("[data-gene-check-progress] span");
    if(progress) progress.style.width = Math.round((Object.keys(state.answers).length / questions.length) * 100) + "%";
    const prev = root.querySelector("[data-gene-check-prev]");
    if(prev) prev.disabled = state.current === 0;
  }
  function scoreBand(total){
    if(total <= 10) return "low";
    if(total <= 18) return "mild";
    if(total <= 29) return "middle";
    return "high";
  }

  function categoryLevel(item){
    const ratio = item.ratio || 0;
    if(ratio < .25) return 1;
    if(ratio < .45) return 2;
    if(ratio < .65) return 3;
    if(ratio < .85) return 4;
    return 5;
  }

  function severityLabelByRatio(score, max){
    const ratio = Number(score || 0) / Math.max(Number(max || 0), 1);
    if(ratio < .25) return "軽度";
    if(ratio < .45) return "やや軽度";
    if(ratio < .65) return "中程度";
    if(ratio < .85) return "強め";
    return "かなり強め";
  }

  function makeLineMessage(categoryScores, categoryMax){
    return [
      "自律神経チェックを行いました。",
      "82項目チェック（3分程度）で、身体の状態を詳しく確認したいです。",
      "",
      "睡眠：" + severityLabelByRatio(categoryScores.sleep || 0, categoryMax.sleep || 0),
      "疲労：" + severityLabelByRatio(categoryScores.fatigue || 0, categoryMax.fatigue || 0),
      "ストレス：" + severityLabelByRatio(categoryScores.stress || 0, categoryMax.stress || 0),
      "胃腸：" + severityLabelByRatio(categoryScores.digestive || 0, categoryMax.digestive || 0)
    ].join("\n");
  }

  function categoryComment(item){
    const meta = categoryMeta[item.key];
    const level = categoryLevel(item);
    const comments = {
      sleep:[
        "睡眠の負担は大きく目立ちません。今のリズムを保てていれば、現時点では過度に心配しすぎなくて大丈夫です。",
        "睡眠に少し負担が出ています。今のうちに整えておくと、疲労感や集中力の低下につながりにくくなります。",
        "睡眠の質が落ち始めている可能性があります。このまま続くと、朝のだるさ・疲れの抜けにくさ・日中の集中力低下につながりやすくなります。",
        "睡眠負担が強めです。寝つき・中途覚醒・朝の疲労感が重なる場合、身体が休息モードに入りにくくなっている可能性があります。",
        "睡眠の負担がかなり強く出ています。放置すると、眠っても回復しない状態が続きやすくなるため、来院時の82項目チェック（3分程度）で詳しく確認することをおすすめします。"
      ],
      fatigue:[
        "疲労の蓄積は大きく目立ちません。日常生活に支障がなければ、まずは今のペースを保ってください。",
        "疲労感が少し出ています。忙しさや睡眠不足が続くと、回復しにくい状態へ進みやすい段階です。",
        "疲労の回復が遅くなっている可能性があります。このまま無理を続けると、朝の重だるさ・集中力低下・休日でも抜けない疲労につながりやすくなります。",
        "疲労負担が強めです。休んでも戻りにくい場合、筋緊張・呼吸の浅さ・自律神経の負担が重なっていることがあります。",
        "疲労の負担がかなり強く出ています。放置すると慢性的なだるさや行動量の低下につながりやすいため、早めに身体の状態を確認することをおすすめします。"
      ],
      stress:[
        "ストレス反応は大きく目立ちません。気分や緊張感が安定していれば、現時点では問題の少ない傾向です。",
        "緊張や不安が少し出やすい傾向です。今のうちに呼吸や休息の取り方を見直すと、強い不調へ進みにくくなります。",
        "ストレス反応が中程度に見られます。気持ちが休まらない状態が続くと、睡眠・胃腸・動悸・不安感にも広がりやすくなります。",
        "ストレス負担が強めです。緊張が抜けにくい、動悸、不安感、浅い呼吸がある場合は、心だけでなく身体面からの確認も大切です。",
        "ストレス反応がかなり強く出ています。我慢で押し切る期間が長くなるほど、睡眠・呼吸・胃腸の不調が重なりやすいため、早めの相談をおすすめします。"
      ],
      nerve:[
        "頭・神経系の負担は大きく目立ちません。頭痛やめまいが少なければ、現時点では問題の少ない傾向です。",
        "頭の重さやふらつきが少し出やすい傾向です。首肩の緊張や疲労の影響を受けている可能性があります。",
        "頭・神経系の負担が中程度に見られます。めまい、頭痛、ぼーっとする感覚が続く場合は、生活に影響が出る前に確認しておきたい状態です。",
        "頭・神経系の負担が強めです。首肩の緊張、睡眠不足、ストレス反応が重なると、ふらつきや頭痛が長引きやすくなります。",
        "頭・神経系の負担がかなり強く出ています。放置すると外出・仕事・日常動作への不安につながりやすいため、来院時に詳しく状態確認することをおすすめします。"
      ],
      digestive:[
        "胃腸の負担は大きく目立ちません。食欲や便通が安定していれば、現時点では問題の少ない傾向です。",
        "胃腸に少し負担が見られます。食事時間、冷え、ストレスで変動しやすい段階です。",
        "胃腸の負担が中程度に見られます。胃の不快感、吐き気、便通の乱れが続くと、食事量や睡眠にも影響しやすくなります。",
        "胃腸負担が強めです。緊張や疲労が続くと、消化機能や腹部の硬さに影響しやすくなります。",
        "胃腸の負担がかなり強く出ています。放置すると食欲・便通・体力低下に関わりやすいため、身体全体の緊張や自律神経との関係を確認することをおすすめします。"
      ],
      breath:[
        "呼吸の負担は大きく目立ちません。息苦しさがなければ、現時点では問題の少ない傾向です。",
        "呼吸が少し浅くなりやすい傾向です。姿勢や首肩の緊張の影響を受けることがあります。",
        "呼吸の負担が中程度に見られます。深呼吸しづらい状態が続くと、緊張が抜けにくくなり、睡眠や不安感にも影響しやすくなります。",
        "呼吸負担が強めです。息苦しさ、胸の詰まり、喉の違和感がある場合は、身体の緊張も確認したい状態です。",
        "呼吸の負担がかなり強く出ています。放置すると日常の不安感や活動量の低下につながりやすいため、来院時の82項目チェック（3分程度）をおすすめします。"
      ],
      circulation:[
        "循環の負担は大きく目立ちません。動悸や冷えが少なければ、現時点では問題の少ない傾向です。",
        "循環に少し負担が見られます。冷えや疲労、睡眠不足で強まりやすい段階です。",
        "循環の負担が中程度に見られます。動悸、胸のざわつき、冷えが続くと、外出や仕事中の不安につながりやすくなります。",
        "循環負担が強めです。緊張や疲労が重なると、心拍や手足の冷えとして感じやすくなります。",
        "循環の負担がかなり強く出ています。強い動悸や急な症状は医療機関を優先しつつ、慢性的な負担は早めの詳細確認をおすすめします。"
      ],
      sensitivity:[
        "感覚過敏や天候の影響は大きく目立ちません。日常生活に支障がなければ、現時点では問題の少ない傾向です。",
        "感覚や気候変化の影響を少し受けやすい傾向です。疲労や睡眠不足で強まりやすい段階です。",
        "感覚・気候変化への負担が中程度に見られます。音・光・気圧で体調が変わる場合は、自律神経の調整力を確認したい状態です。",
        "感覚負担が強めです。刺激に敏感な状態が続くと、外出・睡眠・集中力にも影響しやすくなります。",
        "感覚・気候変化への負担がかなり強く出ています。放置すると生活範囲が狭くなりやすいため、来院時に詳しく確認することをおすすめします。"
      ],
      skin:[
        "皮膚・発汗の負担は大きく目立ちません。肌状態が安定していれば、現時点では問題の少ない傾向です。",
        "皮膚や汗の状態に少し変化が出やすい傾向です。睡眠やストレスとの関係を見ておくと良い段階です。",
        "皮膚・発汗の負担が中程度に見られます。かゆみや肌荒れが体調と連動する場合、睡眠・胃腸・ストレスの影響を受けている可能性があります。",
        "皮膚・発汗の負担が強めです。身体の緊張、睡眠、胃腸、ストレス反応と重なると、波が戻りやすくなることがあります。",
        "皮膚・発汗の負担がかなり強く出ています。慢性的に続く場合は、皮膚だけでなく全身状態とあわせて、来院時の82項目チェック（3分程度）で確認することをおすすめします。"
      ]
    };
    return '<p><strong>'+meta.label+'：'+stars(item.score,item.max)+'</strong><br>'+((comments[item.key] && comments[item.key][level-1]) || '')+'</p>';
  }

  function overallComment(band, totalScore, topLabels){
    if(band === "low"){
      return '<p><strong>総合判定：大きな負担は少ない状態です</strong></p>' +
        '<p>現時点では、強い負担傾向は多くありません。</p>' +
        '<p>ただし、睡眠不足・疲労・ストレスが重なると、今は小さな違和感でも不調として出やすくなることがあります。</p>' +
        '<p>気になる変化が出てきた際や、数日たって状態を確認したい場合は、またこちらのチェックをご利用ください。</p>';
    }
    if(band === "mild"){
      return '<p><strong>総合判定：小さな負担が出始めています</strong></p>' +
        '<p>今は日常生活をこなせる段階でも、同じ不調が続くと、睡眠の質低下・疲労の蓄積・胃腸の乱れ・不安感などにつながりやすくなります。</p>' +
        '<p>2週間以上同じ状態が続く、以前より回復しにくい、生活の質が落ちている場合は、早めに身体の状態を確認することをおすすめします。</p>';
    }
    if(band === "middle"){
      return '<p><strong>総合判定：早めの確認をおすすめします</strong></p>' +
        '<p>'+topLabels.join('・')+'を中心に、身体の負担が積み重なっている可能性があります。</p>' +
        '<p>この段階は、まだ我慢できる一方で、放置すると不眠・慢性疲労・胃腸の不調・動悸・不安感など、複数の不調へ広がりやすい状態です。</p>' +
        '<p>来院時には82項目チェック（3分程度）で、睡眠・疲労・ストレス・胃腸・呼吸・循環などを総合的に確認します。</p>';
    }
    return '<p><strong>総合判定：詳しい確認が必要な状態です</strong></p>' +
      '<p>'+topLabels.join('・')+'の負担が強く出ています。身体が休まりにくい状態が続いている可能性があります。</p>' +
      '<p>このまま様子を見るだけでは、朝起きづらい、眠っても疲れが抜けない、動悸や息苦しさが出やすい、胃腸が乱れる、外出や仕事に不安が出るなど、日常生活への影響が大きくなりやすい状態です。</p>' +
      '<p>自己判断で我慢を続けるより、来院時の82項目チェック（3分程度）で現在の身体の状態を詳しく確認することをおすすめします。</p>';
  }

  function showResult(){
    const root = $("[data-gene-check]");
    if(!root) return;
    const categoryScores = {};
    const categoryMax = {};
    questions.forEach(function(q){
      categoryScores[q.category] = categoryScores[q.category] || 0;
      categoryMax[q.category] = categoryMax[q.category] || 0;
      categoryScores[q.category] += Number(state.answers[q.id] || 0);
      categoryMax[q.category] += 3;
    });
    const ranked = Object.keys(categoryScores).map(function(key){
      return { key:key, score:categoryScores[key], max:categoryMax[key], ratio:categoryScores[key] / Math.max(categoryMax[key],1) };
    }).sort(function(a,b){ return b.ratio - a.ratio; });
    const top = ranked.slice(0,3);
    const resultId = makeId();
    tracking.completed = true;
    tracking.resultId = resultId;
    const totalScore = questions.reduce(function(sum,q){ return sum + Number(state.answers[q.id] || 0); }, 0);
    const result = {
      id: resultId,
      sessionId:tracking.sessionId,
      sourcePage:tracking.entryPage || sourcePage(),
      createdAt: new Date().toISOString(),
      answers: state.answers,
      scores: categoryScores,
      totalScore: totalScore,
      scoreBand: scoreBand(totalScore),
      top: top.map(function(item){ return item.key; }),
      futureStatus:{
        lineClicked:false,
        bookingConfirmed:false,
        visitCompleted:false,
        detail82Completed:false,
        recheckCompleted:false
      }
    };
    try{ localStorage.setItem("geneQuickCheckLatest", JSON.stringify(result)); }catch(e){}
    root.querySelector("[data-gene-check-main]").style.display = "none";
    const resultEl = root.querySelector("[data-gene-check-result]");
    resultEl.classList.add("is-active");
    const bars = resultEl.querySelector("[data-gene-check-bars]");
    bars.innerHTML = top.map(function(item){
      const meta = categoryMeta[item.key];
      const percent = Math.round(item.ratio * 100);
      return '<div class="gene-check-bar-row">' +
        '<div class="gene-check-bar-label">'+meta.label+'</div>' +
        '<div class="gene-check-bar-track"><div class="gene-check-bar-fill" style="width:'+percent+'%"></div></div>' +
        '<div class="gene-check-bar-stars">'+stars(item.score,item.max)+'</div>' +
      '</div>';
    }).join("");
    const topLabels = top.map(function(item){ return categoryMeta[item.key].label; });
    const band = scoreBand(totalScore);
    const resultText = resultEl.querySelector("[data-gene-check-result-text]");
    resultText.innerHTML = overallComment(band, totalScore, topLabels) + top.map(categoryComment).join("") +
      '<p class="gene-check-result-note">※この結果は診断ではありません。強い症状、急な悪化、胸痛、激しいめまい、しびれなどがある場合は、医療機関での確認を優先してください。</p>';
    const lineMessage = makeLineMessage(categoryScores, categoryMax);
    const lineBtn = resultEl.querySelector("[data-gene-check-line]");
    if(lineBtn){
      if(band === "low"){
        lineBtn.textContent = "気になる変化をLINEで相談する";
      }else if(band === "mild"){
        lineBtn.textContent = "続く不調をLINEで相談する";
      }else{
        lineBtn.textContent = "82項目チェック（3分程度）をLINEで相談する";
      }
      lineBtn.setAttribute("data-gene-line-message", lineMessage);
      lineBtn.href = "https://lin.ee/6bBKc67?text=" + encodeURIComponent(lineMessage);
    }
    const related = resultEl.querySelector("[data-gene-check-related]");
    const seen = {};
    const relatedLinks = top.flatMap(function(item){ return categoryMeta[item.key].links; }).filter(function(link){
      if(seen[link[0]]) return false;
      seen[link[0]] = true;
      return true;
    }).slice(0,5).map(function(link){ return '<a href="'+link[0]+'">'+link[1]+'</a>'; }).join("");
    related.innerHTML = relatedLinks ? '<p class="gene-check-related-title">今回の結果に近い症状ページ</p>' + relatedLinks : "";
    trackEvent("quick_check_complete", {
      event_label: resultId,
      check_id: resultId,
      top_category_1: top[0] ? top[0].key : "",
      top_category_2: top[1] ? top[1].key : "",
      top_category_3: top[2] ? top[2].key : "",
      total_score: totalScore,
      score_band: scoreBand(totalScore),
      sleep_score: categoryScores.sleep || 0,
      fatigue_score: categoryScores.fatigue || 0,
      stress_score: categoryScores.stress || 0,
      nerve_score: categoryScores.nerve || 0,
      digestive_score: categoryScores.digestive || 0,
      breath_score: categoryScores.breath || 0,
      circulation_score: categoryScores.circulation || 0,
      sensitivity_score: categoryScores.sensitivity || 0,
      skin_score: categoryScores.skin || 0,
      funnel_stage:"complete"
    });
    window.scrollTo({ top: resultEl.getBoundingClientRect().top + window.pageYOffset - 80, behavior:"smooth" });
  }

  function setupConversionTracking(){
    document.addEventListener("click", function(e){
      const lineLink = e.target.closest("a[href*='lin.ee']");
      if(!lineLink) return;
      const isResultLine = !!lineLink.closest("[data-gene-check-result]");
      if(isResultLine){
        tracking.lineClicked = true;
        const lineMessage = lineLink.getAttribute("data-gene-line-message") || "";
        if(lineMessage && navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(lineMessage).catch(function(){});
        }
        try{
          const latest = JSON.parse(localStorage.getItem("geneQuickCheckLatest") || "{}");
          if(latest && latest.id === tracking.resultId){
            latest.futureStatus = latest.futureStatus || {};
            latest.futureStatus.lineClicked = true;
            latest.futureStatus.lineClickedAt = new Date().toISOString();
            localStorage.setItem("geneQuickCheckLatest", JSON.stringify(latest));
          }
        }catch(e){}
        trackEvent("quick_check_line_click", {
          event_label: tracking.resultId || "unknown",
          check_id: tracking.resultId || "",
          link_url: lineLink.href,
          funnel_stage:"line_click"
        });
      }else{
        trackEvent("line_click_from_check_page", { link_url: lineLink.href });
      }
    });

    function sendExitStatus(){
      if(tracking.exitSent) return;
      if(tracking.completed && !tracking.lineClicked){
        tracking.exitSent = true;
        sendExitEvent("quick_check_exit_without_line", {
          event_label: tracking.resultId || "unknown",
          check_id: tracking.resultId || "",
          funnel_stage:"exit_after_result_without_line"
        });
      }else if(tracking.started && !tracking.completed){
        tracking.exitSent = true;
        sendExitEvent("quick_check_partial_exit", {
          answered_count: Object.keys(state.answers).length,
          last_question_index: state.current + 1,
          last_question_id: questions[state.current] ? questions[state.current].id : "",
          last_question_category: questions[state.current] ? questions[state.current].category : "",
          funnel_stage:"partial_exit"
        });
      }
    }

    window.addEventListener("pagehide", sendExitStatus);
    document.addEventListener("visibilitychange", function(){
      if(document.visibilityState === "hidden") sendExitStatus();
    });
  }

  setupConversionTracking();
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", render);
  }else{
    render();
  }
})();