<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2017 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: zhangyajun <448901948@qq.com>
// +----------------------------------------------------------------------

namespace addons\cms\library;

use think\Paginator;

class Bootstrap extends Paginator
{
    /**
     * 上一页按钮
     * @param string $text
     * @return string
     */
    protected function getPreviousButton($text = "« Previous")
    {
        if ($this->currentPage() <= 1) {
            return $this->getDisabledTextWrapper($text);
        }

        $url = $this->url(
            $this->currentPage() - 1
        );

        // return $this->getPageLinkWrapper($url, $text);
        return $this->getPreviousWrapper($url, $text);
    }

    protected function getPreviousWrapper($url, $text)
    {
        return '<li class="page-item bg-color" aria-disabled="true" aria-label="« Previous"><a class="page-link" href="' . htmlentities($url) . '"> <span class="page-link rel_ck" aria-hidden="true">
        <span class="iconfont iconchaopimiaotuangou-">' . $text .' </span></span> </a></li>';
    }

    /**
     * 下一页按钮
     * @param string $text
     * @return string
     */
    protected function getNextButton($text = "Next »")
    {
        if (!$this->hasMore) {
            return $this->getDisabledTextWrapper($text);
        }

        $url = $this->url($this->currentPage() + 1);

        return $this->getNextWrapper($url, $text);
    }

    protected function getNextWrapper($url, $text)
    {
        return '<li class="page-item">
        <a class="page-link rel_ck bg-color" href="' . htmlentities($url) . '" rel="next" aria-label="Next »"><span class="iconfont iconleft">' . $text .' </span></a> </li>';
    }
    
    /**
    * 总页码数
    *
    */
    public function getAllPage()
    {
        $params = "";
        $lastPage = $this->lastPage;
        if(!empty($_REQUEST['page'])){
            $page = $_REQUEST['page'];
            $params = "<strong>" . $page . "/" . $lastPage . "</strong>";
        }else{
            $params = "<strong>1/" . $lastPage . "</strong>";
        }
        return $params;
    }
    
    /**
     * 输入页码翻页
     * @return string
     */    
    protected  function getGoPage()
    {
        $params = "";
        $lastPage = $this->lastPage;
        if(!empty($_REQUEST['page'])){
            //分页进来带参数
            foreach($_REQUEST as $k=>$v){
                if($k == 'page'){
                    $params .= '<input type="number" class="number" min="1" max="'.$lastPage.'" name="page" required value="'.$v.'" /> <b><em>页</em></b>';
                }else{
                    //可能会出现报错，这里做判断处理
                    if(is_array($v)){
                        $str = $v[0];
                    }else{
                        $str = $v;
                    }
                    $params .="<input type='hidden' name='".$k."' value='".$str."'>";
                }
            }
        }else{
            //没分页显示初始
            $params = '<input type="number" class="number" min="1" max="'.$lastPage.'" name="page" required value="" /> <b><em>页</em></b>';
            
        }

        return "<form action='' class='GoForm'><input type='submit' value='前往' class='submit'/>".$params."</form>";
    }

    /**
     * 页码按钮
     * @return string
     */
    protected function getLinks()
    {
        if ($this->simple) {
            return '';
        }

        $block = [
            'first'  => null,
            'slider' => null,
            'last'   => null
        ];

        $side = 3;
        $window = $side * 2;

        if ($this->lastPage < $window + 6) {
            $block['first'] = $this->getUrlRange(1, $this->lastPage);
        } elseif ($this->currentPage <= $window) {
            $block['first'] = $this->getUrlRange(1, $window + 2);
            $block['last'] = $this->getUrlRange($this->lastPage - 1, $this->lastPage);
        } elseif ($this->currentPage > ($this->lastPage - $window)) {
            $block['first'] = $this->getUrlRange(1, 2);
            $block['last'] = $this->getUrlRange($this->lastPage - ($window + 2), $this->lastPage);
        } else {
            $block['first'] = $this->getUrlRange(1, 2);
            $block['slider'] = $this->getUrlRange($this->currentPage - $side, $this->currentPage + $side);
            $block['last'] = $this->getUrlRange($this->lastPage - 1, $this->lastPage);
        }

        $html = '';

        if (is_array($block['first'])) {
            $html .= $this->getUrlLinks($block['first']);
        }

        if (is_array($block['slider'])) {
            $html .= $this->getDots();
            $html .= $this->getUrlLinks($block['slider']);
        }

        if (is_array($block['last'])) {
            $html .= $this->getDots();
            $html .= $this->getUrlLinks($block['last']);
        }
        return $html;
    }

    /**
     * 渲染分页html
     * @return mixed
     */
    public function render($params = null)
    {
        if (is_array($params)) {
            if (isset($params['type'])) {
                $this->simple = $params['type'] === 'simple';
            }
        }
        if ($this->hasPages()) {
            if ($this->simple) {
                return sprintf(
                    '<ul class="pager">%s %s</ul>',
                    $this->getPreviousButton(),
                    $this->getNextButton()
                );
            } else {
                return sprintf(
                    '<ul class="pagination">%s %s %s</ul>',
                    $this->getPreviousButton(),
                    $this->getLinks(),
                   // $this->getGoPage(),
                    // $this->getAllPage(),
                    $this->getNextButton()
                     
                );
            }
        }
    }

    public function getNextPage()
    {
        return $this->currentPage + 1;
    }

    /**
     * 生成一个可点击的按钮
     *
     * @param  string $url
     * @param  int    $page
     * @return string
     */
    protected function getAvailablePageWrapper($url, $page)
    {
        // return '<a href="' . htmlentities($url) . '">' . $page . '</a>';
        return '<li class="page-item"><a class="page-link" href="' . htmlentities($url) . '">' . $page . '</a></li>';
    }

    /**
     * 生成一个禁用的按钮
     *
     * @param  string $text
     * @return string
     */
    protected function getDisabledTextWrapper($text)
    {
        if ($text == '...') {
            return '<li class="page-item" aria-disabled="true"><span class="page-link">...</span></li>';
        }
        // return '<a href="javascript:">' . $text . '</a>';
        return '<li class="page-item disabled bg-color" aria-disabled="true" aria-label="« Previous"> <span class="page-link rel_ck" aria-hidden="true">
        <span class="iconfont iconchaopimiaotuangou-">' . $text .' </span></span> </li>';
    }

    /**
     * 生成一个激活的按钮
     *
     * @param  string $text
     * @return string
     */
    protected function getActivePageWrapper($text)
    {
        // return '<a class="current">' . $text . '</a>';
        return '<li class="page-item active" aria-current="page">
        <span class="page-link active font-color">' . $text . '</span></li>';
    }

    /**
     * 生成省略号按钮
     *
     * @return string
     */
    protected function getDots()
    {
        return $this->getDisabledTextWrapper('...');
    }

    /**
     * 批量生成页码按钮.
     *
     * @param  array $urls
     * @return string
     */
    protected function getUrlLinks(array $urls)
    {
        $html = '';

        foreach ($urls as $page => $url) {
            $html .= $this->getPageLinkWrapper($url, $page);
        }

        return $html;
    }

    /**
     * 生成普通页码按钮
     *
     * @param  string $url
     * @param  int    $page
     * @return string
     */
    protected function getPageLinkWrapper($url, $page)
    {
        if ($page == $this->currentPage()) {
            return $this->getActivePageWrapper($page);
        }

        return $this->getAvailablePageWrapper($url, $page);
    }
}
