"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.invoke(channel, ...omit);
  },
  once(...args) {
    const [channel, ...omit] = args;
    electron.ipcRenderer.once(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent, child) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  }
};
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlwY1JlbmRlcmVyLCBjb250ZXh0QnJpZGdlIH0gZnJvbSBcImVsZWN0cm9uXCI7XHJcblxyXG4vLyAtLS0tLS0tLS0gRXhwb3NlIHNvbWUgQVBJIHRvIHRoZSBSZW5kZXJlciBwcm9jZXNzIC0tLS0tLS0tLVxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwiaXBjUmVuZGVyZXJcIiwge1xyXG5cdG9uKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLm9uPikge1xyXG5cdFx0Y29uc3QgW2NoYW5uZWwsIGxpc3RlbmVyXSA9IGFyZ3M7XHJcblx0XHRpcGNSZW5kZXJlci5vbihjaGFubmVsLCAoZXZlbnQsIC4uLmFyZ3MpID0+IGxpc3RlbmVyKGV2ZW50LCAuLi5hcmdzKSk7XHJcblx0fSxcclxuXHRvZmYoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIub2ZmPikge1xyXG5cdFx0Y29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJncztcclxuXHRcdGlwY1JlbmRlcmVyLm9mZihjaGFubmVsLCAuLi5vbWl0KTtcclxuXHR9LFxyXG5cdHNlbmQoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIuc2VuZD4pIHtcclxuXHRcdGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3M7XHJcblx0XHRpcGNSZW5kZXJlci5zZW5kKGNoYW5uZWwsIC4uLm9taXQpO1xyXG5cdH0sXHJcblx0aW52b2tlKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLmludm9rZT4pIHtcclxuXHRcdGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3M7XHJcblx0XHRpcGNSZW5kZXJlci5pbnZva2UoY2hhbm5lbCwgLi4ub21pdCk7XHJcblx0fSxcclxuXHRvbmNlKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLm9uY2U+KSB7XHJcblx0XHRjb25zdCBbY2hhbm5lbCwgLi4ub21pdF0gPSBhcmdzO1xyXG5cdFx0aXBjUmVuZGVyZXIub25jZShjaGFubmVsLCAuLi5vbWl0KTtcclxuXHR9LFxyXG5cclxuXHQvLyBZb3UgY2FuIGV4cG9zZSBvdGhlciBBUFRzIHlvdSBuZWVkIGhlcmUuXHJcblx0Ly8gLi4uXHJcbn0pO1xyXG5cclxuLy8gLS0tLS0tLS0tIFByZWxvYWQgc2NyaXB0cyBsb2FkaW5nIC0tLS0tLS0tLVxyXG5mdW5jdGlvbiBkb21SZWFkeShcclxuXHRjb25kaXRpb246IERvY3VtZW50UmVhZHlTdGF0ZVtdID0gW1wiY29tcGxldGVcIiwgXCJpbnRlcmFjdGl2ZVwiXVxyXG4pIHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuXHRcdGlmIChjb25kaXRpb24uaW5jbHVkZXMoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcclxuXHRcdFx0cmVzb2x2ZSh0cnVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcclxuXHRcdFx0XHRpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmNvbnN0IHNhZmVET00gPSB7XHJcblx0YXBwZW5kKHBhcmVudDogSFRNTEVsZW1lbnQsIGNoaWxkOiBIVE1MRWxlbWVudCkge1xyXG5cdFx0aWYgKCFBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZCgoZSkgPT4gZSA9PT0gY2hpbGQpKSB7XHJcblx0XHRcdHJldHVybiBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVtb3ZlKHBhcmVudDogSFRNTEVsZW1lbnQsIGNoaWxkOiBIVE1MRWxlbWVudCkge1xyXG5cdFx0aWYgKEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maW5kKChlKSA9PiBlID09PSBjaGlsZCkpIHtcclxuXHRcdFx0cmV0dXJuIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBodHRwczovL3RvYmlhc2FobGluLmNvbS9zcGlua2l0XHJcbiAqIGh0dHBzOi8vY29ubm9yYXRoZXJ0b24uY29tL2xvYWRlcnNcclxuICogaHR0cHM6Ly9wcm9qZWN0cy5sdWtlaGFhcy5tZS9jc3MtbG9hZGVyc1xyXG4gKiBodHRwczovL21hdGVqa3VzdGVjLmdpdGh1Yi5pby9TcGluVGhhdFNoaXRcclxuICovXHJcbmZ1bmN0aW9uIHVzZUxvYWRpbmcoKSB7XHJcblx0Y29uc3QgY2xhc3NOYW1lID0gYGxvYWRlcnMtY3NzX19zcXVhcmUtc3BpbmA7XHJcblx0Y29uc3Qgc3R5bGVDb250ZW50ID0gYFxyXG5Aa2V5ZnJhbWVzIHNxdWFyZS1zcGluIHtcclxuICAyNSUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgwKTsgfVxyXG4gIDUwJSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDE4MGRlZyk7IH1cclxuICA3NSUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDApIHJvdGF0ZVkoMTgwZGVnKTsgfVxyXG4gIDEwMCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDApIHJvdGF0ZVkoMCk7IH1cclxufVxyXG4uJHtjbGFzc05hbWV9ID4gZGl2IHtcclxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xyXG4gIHdpZHRoOiA1MHB4O1xyXG4gIGhlaWdodDogNTBweDtcclxuICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gIGFuaW1hdGlvbjogc3F1YXJlLXNwaW4gM3MgMHMgY3ViaWMtYmV6aWVyKDAuMDksIDAuNTcsIDAuNDksIDAuOSkgaW5maW5pdGU7XHJcbn1cclxuLmFwcC1sb2FkaW5nLXdyYXAge1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICB0b3A6IDA7XHJcbiAgbGVmdDogMDtcclxuICB3aWR0aDogMTAwdnc7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYmFja2dyb3VuZDogIzI4MmMzNDtcclxuICB6LWluZGV4OiA5O1xyXG59XHJcbiAgICBgO1xyXG5cdGNvbnN0IG9TdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRjb25zdCBvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcblx0b1N0eWxlLmlkID0gXCJhcHAtbG9hZGluZy1zdHlsZVwiO1xyXG5cdG9TdHlsZS5pbm5lckhUTUwgPSBzdHlsZUNvbnRlbnQ7XHJcblx0b0Rpdi5jbGFzc05hbWUgPSBcImFwcC1sb2FkaW5nLXdyYXBcIjtcclxuXHRvRGl2LmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+PGRpdj48L2Rpdj48L2Rpdj5gO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0YXBwZW5kTG9hZGluZygpIHtcclxuXHRcdFx0c2FmZURPTS5hcHBlbmQoZG9jdW1lbnQuaGVhZCwgb1N0eWxlKTtcclxuXHRcdFx0c2FmZURPTS5hcHBlbmQoZG9jdW1lbnQuYm9keSwgb0Rpdik7XHJcblx0XHR9LFxyXG5cdFx0cmVtb3ZlTG9hZGluZygpIHtcclxuXHRcdFx0c2FmZURPTS5yZW1vdmUoZG9jdW1lbnQuaGVhZCwgb1N0eWxlKTtcclxuXHRcdFx0c2FmZURPTS5yZW1vdmUoZG9jdW1lbnQuYm9keSwgb0Rpdik7XHJcblx0XHR9LFxyXG5cdH07XHJcbn1cclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbmNvbnN0IHsgYXBwZW5kTG9hZGluZywgcmVtb3ZlTG9hZGluZyB9ID0gdXNlTG9hZGluZygpO1xyXG5kb21SZWFkeSgpLnRoZW4oYXBwZW5kTG9hZGluZyk7XHJcblxyXG53aW5kb3cub25tZXNzYWdlID0gKGV2KSA9PiB7XHJcblx0ZXYuZGF0YS5wYXlsb2FkID09PSBcInJlbW92ZUxvYWRpbmdcIiAmJiByZW1vdmVMb2FkaW5nKCk7XHJcbn07XHJcblxyXG5zZXRUaW1lb3V0KHJlbW92ZUxvYWRpbmcsIDQ5OTkpO1xyXG4iXSwibmFtZXMiOlsiY29udGV4dEJyaWRnZSIsImlwY1JlbmRlcmVyIiwiYXJncyJdLCJtYXBwaW5ncyI6Ijs7QUFHQUEsU0FBQUEsY0FBYyxrQkFBa0IsZUFBZTtBQUFBLEVBQzlDLE1BQU0sTUFBeUM7QUFDeEMsVUFBQSxDQUFDLFNBQVMsUUFBUSxJQUFJO0FBQ2hCQyxhQUFBQSxZQUFBLEdBQUcsU0FBUyxDQUFDLFVBQVVDLFVBQVMsU0FBUyxPQUFPLEdBQUdBLEtBQUksQ0FBQztBQUFBLEVBQ3JFO0FBQUEsRUFDQSxPQUFPLE1BQTBDO0FBQ2hELFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQ2ZELGFBQUFBLFlBQUEsSUFBSSxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQ2pDO0FBQUEsRUFDQSxRQUFRLE1BQTJDO0FBQ2xELFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQ2ZBLGFBQUFBLFlBQUEsS0FBSyxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQ2xDO0FBQUEsRUFDQSxVQUFVLE1BQTZDO0FBQ3RELFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQ2ZBLGFBQUFBLFlBQUEsT0FBTyxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQ3BDO0FBQUEsRUFDQSxRQUFRLE1BQTJDO0FBQ2xELFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQ2ZBLGFBQUFBLFlBQUEsS0FBSyxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQ2xDO0FBQUE7QUFBQTtBQUlELENBQUM7QUFHRCxTQUFTLFNBQ1IsWUFBa0MsQ0FBQyxZQUFZLGFBQWEsR0FDM0Q7QUFDTSxTQUFBLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDL0IsUUFBSSxVQUFVLFNBQVMsU0FBUyxVQUFVLEdBQUc7QUFDNUMsY0FBUSxJQUFJO0FBQUEsSUFBQSxPQUNOO0FBQ0csZUFBQSxpQkFBaUIsb0JBQW9CLE1BQU07QUFDbkQsWUFBSSxVQUFVLFNBQVMsU0FBUyxVQUFVLEdBQUc7QUFDNUMsa0JBQVEsSUFBSTtBQUFBLFFBQ2I7QUFBQSxNQUFBLENBQ0E7QUFBQSxJQUNGO0FBQUEsRUFBQSxDQUNBO0FBQ0Y7QUFFQSxNQUFNLFVBQVU7QUFBQSxFQUNmLE9BQU8sUUFBcUIsT0FBb0I7QUFDM0MsUUFBQSxDQUFDLE1BQU0sS0FBSyxPQUFPLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxNQUFNLEtBQUssR0FBRztBQUNuRCxhQUFBLE9BQU8sWUFBWSxLQUFLO0FBQUEsSUFDaEM7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPLFFBQXFCLE9BQW9CO0FBQzNDLFFBQUEsTUFBTSxLQUFLLE9BQU8sUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLE1BQU0sS0FBSyxHQUFHO0FBQ2xELGFBQUEsT0FBTyxZQUFZLEtBQUs7QUFBQSxJQUNoQztBQUFBLEVBQ0Q7QUFDRDtBQVFBLFNBQVMsYUFBYTtBQUNyQixRQUFNLFlBQVk7QUFDbEIsUUFBTSxlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FPbkIsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBb0JMLFFBQUEsU0FBUyxTQUFTLGNBQWMsT0FBTztBQUN2QyxRQUFBLE9BQU8sU0FBUyxjQUFjLEtBQUs7QUFFekMsU0FBTyxLQUFLO0FBQ1osU0FBTyxZQUFZO0FBQ25CLE9BQUssWUFBWTtBQUNaLE9BQUEsWUFBWSxlQUFlLFNBQVM7QUFFbEMsU0FBQTtBQUFBLElBQ04sZ0JBQWdCO0FBQ1AsY0FBQSxPQUFPLFNBQVMsTUFBTSxNQUFNO0FBQzVCLGNBQUEsT0FBTyxTQUFTLE1BQU0sSUFBSTtBQUFBLElBQ25DO0FBQUEsSUFDQSxnQkFBZ0I7QUFDUCxjQUFBLE9BQU8sU0FBUyxNQUFNLE1BQU07QUFDNUIsY0FBQSxPQUFPLFNBQVMsTUFBTSxJQUFJO0FBQUEsSUFDbkM7QUFBQSxFQUFBO0FBRUY7QUFJQSxNQUFNLEVBQUUsZUFBZSxrQkFBa0I7QUFDekMsV0FBVyxLQUFLLGFBQWE7QUFFN0IsT0FBTyxZQUFZLENBQUMsT0FBTztBQUN2QixLQUFBLEtBQUssWUFBWSxtQkFBbUIsY0FBYztBQUN0RDtBQUVBLFdBQVcsZUFBZSxJQUFJOyJ9
